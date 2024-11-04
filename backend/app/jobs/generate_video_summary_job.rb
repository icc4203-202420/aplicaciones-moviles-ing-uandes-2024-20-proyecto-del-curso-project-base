class GenerateVideoSummaryJob < ApplicationJob
  queue_as :default

  def perform(event_id)
    event = Event.find(event_id)
    images = event.event_pictures.map(&:image) # Obtener las imágenes de event_pictures

    # Asegúrate de que haya imágenes disponibles
    return if images.empty?

    # Crear una lista de archivos de imagen temporal
    image_files = images.map do |image|
      download_image(image)
    end

    # Define la ruta del archivo de salida
    output_file = "/tmp/video_summary_#{event_id}.mp4"

    # Generar el video usando FFmpeg
    create_video(image_files, output_file)

    # Subir el video a Active Storage
    upload_video_to_storage(event, output_file)

    # Eliminar archivos temporales
    cleanup_temp_files(image_files, output_file)
  end

  private

  def download_image(image)
    # Aquí se asume que la imagen está almacenada en Active Storage.
    temp_file = "/tmp/#{image.filename}"

    # Guardar el archivo temporalmente
    File.open(temp_file, 'wb') do |file|
      file.write(image.download)
    end

    temp_file
  end

  def create_video(image_files, output_file)
    # Genera el comando FFmpeg
    # Ajusta la construcción del comando para usar una lista de imágenes
    inputs = image_files.map { |file| "-i #{file}" }.join(" ")
    command = "ffmpeg -y -framerate 1 #{inputs} -filter_complex \"concat=n=#{image_files.size}:v=1:a=0\" -c:v libx264 -pix_fmt yuv420p #{output_file}"

    # Ejecuta el comando
    system(command)

    # Verifica si el comando se ejecutó correctamente
    raise "FFmpeg failed to create video" unless $?.success?
  end

  def upload_video_to_storage(event, output_file)
    # Sube el video a Active Storage
    event.video.attach(io: File.open(output_file), filename: "video_summary_#{event.id}.mp4")
  end

  def cleanup_temp_files(image_files, output_file)
    image_files.each { |file| File.delete(file) if File.exist?(file) }
    File.delete(output_file) if File.exist?(output_file)
  end
end