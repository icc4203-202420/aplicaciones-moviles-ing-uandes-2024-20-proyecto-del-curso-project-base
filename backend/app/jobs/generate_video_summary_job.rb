require 'open3'

class GenerateVideoSummaryJob < ApplicationJob
  queue_as :default

  def perform(event_id)
    # Directorio temporal para las imágenes procesadas
    Dir.mktmpdir do |tmpdir|
      temp_images = []

      # Descargar y procesar imágenes
      images = download_images(event_id)
      if images.empty?
        Rails.logger.error("No se encontraron imágenes para el evento con ID #{event_id}")
        return  # Salir si no hay imágenes
      end

      images.each_with_index do |event_picture, index|
        unless event_picture.image.attached?
          Rails.logger.error("El EventPicture con ID #{event_picture.id} no tiene una imagen adjunta")
          next
        end

        begin
          processed_image = MiniMagick::Image.read(event_picture.image.download) do |img|
            img.resize "1280x720!"  # Redimensionar a 1280x720
            img.format "jpg"         # Convertir a JPEG
          end

          # Verificar que las dimensiones sean divisibles por 2
          width = processed_image.width
          height = processed_image.height
          if width % 2 != 0 || height % 2 != 0
            Rails.logger.warn("La imagen procesada con ID #{event_picture.id} tiene dimensiones no divisibles por 2 (#{width}x#{height}). Se omitirá.")
            next
          end

          # Guardar la imagen procesada en un archivo temporal
          image_path = File.join(tmpdir, "event_#{event_id}_img_#{index}.jpg")
          File.open(image_path, "wb") { |file| file.write(processed_image.to_blob) }

          # Verificar que la imagen se haya guardado correctamente
          if File.exist?(image_path) && File.size(image_path) > 0
            temp_images << image_path
            Rails.logger.info("Imagen procesada y guardada: #{image_path}")
          else
            raise "Error: El archivo de imagen temporal no se creó o está vacío: #{image_path}"
          end

        rescue => e
          Rails.logger.error("Error al procesar la imagen: #{e.message}")
          raise e  # Propagar el error para reintentar el trabajo o registrar el fallo
        end
      end

      # Crear el video a partir de las imágenes procesadas
      create_video_from_images(temp_images, event_id, tmpdir)
    end
  end

  private

  def download_images(event_id)
    event = Event.find_by(id: event_id)
    event ? event.event_pictures.with_attached_image : []
  end

  def create_video_from_images(temp_images, event_id, tmpdir)
    concat_file_path = File.join(tmpdir, "concat_list.txt")
    File.open(concat_file_path, "w") do |file|
      temp_images.each { |img| file.puts "file '#{img}'" }
    end

    # Ruta para el video de salida
    video_path = Rails.root.join("tmp", "event_#{event_id}.mp4")

    # Comando FFmpeg con -y para sobrescribir el archivo existente
    output_command = "ffmpeg -y -f concat -safe 0 -i '#{concat_file_path}' -c:v libx264 -pix_fmt yuv420p '#{video_path}'"

    stdout, stderr, status = Open3.capture3(output_command)

    if status.success?
      Rails.logger.info("Video creado exitosamente: #{video_path}")
    else
      Rails.logger.error("Error al ejecutar FFmpeg: #{stderr}")
      raise "Error al crear el video con FFmpeg: #{stderr}"
    end
  end
end
