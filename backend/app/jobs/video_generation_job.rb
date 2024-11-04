class GenerateVideoSummaryJob < ApplicationJob
  queue_as :default

  def perform(event_id)
    event = Event.find(event_id)
    images = event.event_pictures.map(&:image).map(&:download)

    video_path = Rails.root.join("tmp", "event_summary_#{event_id}.mp4")

    create_video(images, video_path)

    # Guardar el video como un archivo estático en el evento
    event.update(video_summary: video_path)

    # Aquí puedes agregar lógica para notificar a los usuarios, por ejemplo:
    notify_users(event)
  end

  private

  def create_video(images, output_path)
    # Comando de FFmpeg para crear un video a partir de las imágenes
    image_files = images.join(" ")
    system("ffmpeg -y -r 1 -i #{image_files} -c:v libx264 -vf \"fps=25,format=yuv420p\" #{output_path}")
  end

  def notify_users(event)
    event.users.each do |user|
      # Lógica para enviar notificaciones a los usuarios
      # Podrías usar ActionMailer o cualquier otra solución de notificación
    end
  end
end
