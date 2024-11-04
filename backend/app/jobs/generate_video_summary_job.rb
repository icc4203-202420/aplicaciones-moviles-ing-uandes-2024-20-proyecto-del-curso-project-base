require 'open3'

class GenerateVideoSummaryJob < ApplicationJob
  queue_as :default

  def perform(event_id)
    event = Event.find(event_id)

    # Genera el video y obtiene la ruta del video
    video_url = create_video(event)

    # En este punto, en lugar de almacenar la URL en la base de datos,
    # puedes manejar la URL como necesites.
    Rails.logger.info "Video generated for event #{event_id}: #{video_url}"

    # Si necesitas realizar otras acciones, puedes hacerlo aquí
  end

  private

  def create_video(event)
    images = event.event_pictures.map(&:image) # Asumiendo que event_pictures tiene un atributo 'image'
    
    # Crear un array para almacenar los archivos temporales
    temp_files = []
  
    images.each do |image|
      # Asegúrate de que la imagen esté adjunta
      next unless image.attached?
  
      # Descarga la imagen y guárdala temporalmente
      temp_file = Tempfile.new(['image', File.extname(image.filename.to_s)])
      temp_file.binmode
      temp_file.write(image.download)
      temp_file.rewind
      temp_files << temp_file.path
    end
  
    # Llama a tu método de FFmpeg para crear el video
    video_url = generate_video_from_images(temp_files)
  
    # Limpia los archivos temporales después de usarlos
    temp_files.each { |path| File.delete(path) if File.exist?(path) }
  
    video_url
  end
  
  def generate_video_from_images(image_paths)
    output_video_path = "public/uploads/videos/event_video_#{SecureRandom.uuid}.mp4" # Cambia a un directorio accesible

    # Comando de FFmpeg (ajusta según tus necesidades)
    command = "ffmpeg -y -framerate 1 -i #{image_paths.join(' -i ')} -c:v libx264 -pix_fmt yuv420p #{output_video_path}"
    
    system(command)
  
    # Retorna la URL o el path del video generado
    output_video_path
  end  
end