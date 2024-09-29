require 'factory_bot_rails'

# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# Initialize the review counter
ReviewCounter.create(count: 0)

if Rails.env.development?

  # Crear países
  countries = FactoryBot.create_list(:country, 5)

  # Crear cervecerías (breweries) con marcas (brands) y cervezas (beers)
  countries.map do |country|
    FactoryBot.create(:brewery_with_brands_with_beers, countries: [country])
  end

  # Crear usuarios con direcciones asociadas
  users = FactoryBot.create_list(:user, 10) do |user, i|
    user.address.update(country: countries.sample)
  end

  # Crear bares con direcciones y cervezas asociadas
  bars = FactoryBot.create_list(:bar, 5) do |bar|
    bar.address.update(country: countries.sample)
    bar.beers << Beer.all.sample(rand(1..3))
  end

  # Crear eventos asociados a los bares
  events = bars.map do |bar|
    FactoryBot.create(:event, bar: bar, name: "Event at #{bar.address.city}", date: 1.week.from_now)
  end

  # Crear relaciones de amistad entre usuarios
  users.combination(2).to_a.sample(5).each do |user_pair|
    FactoryBot.create(:friendship, user: user_pair[0], friend: user_pair[1], bar: bars.sample)
  end

  # Crear attendances (asistencia) de usuarios a eventos
  users.each do |user|
    events.sample(rand(1..3)).each do |event|
      FactoryBot.create(:attendance, user: user, event: event, checked_in: [true, false].sample)
    end
  end


  users = FactoryBot.create_list(:user, 10) do |user|
    user.address.update(country: countries.sample)
  end

  # Si quieres ver un ejemplo detallado de cómo se generan usuarios, aquí te dejo algo simple:
  10.times do |i|
    User.create!(
      first_name: "User#{i + 1}",
      last_name: "Lastname#{i + 1}",
      email: "user#{i + 1}@example.com",
      password: "password123",
      age: rand(18..65),
      handle: "user_handle_#{i + 1}"
    )
  end


  require 'faker'

  # Ruta a la carpeta de imágenes
  images_path = Rails.root.join('db', 'seeds', 'images')
  
  if Dir.exist?(images_path)
    image_files = Dir.children(images_path)
  
    # Itera sobre los eventos y les asigna imágenes desde la carpeta 'seeds/images'
    Event.all.each do |event|
      num_images = rand(1..3)
      selected_images = image_files.sample(num_images)
    
      if selected_images.any?
        EventPicture.create!(
          event: event,
          user: User.all.sample,
          description: Faker::Lorem.sentence(word_count: 10),
          created_at: Time.now,
          updated_at: Time.now,
          pictures_url: selected_images.map { |image_file| File.join('seeds/images', image_file) }
        )
      else
        puts "No se encontraron archivos de imagen en la carpeta seeds/images para el evento #{event.id}."
      end
    end
  else
    puts "Carpeta de imágenes no encontrada, no se pueden asignar imágenes a los eventos."
  end
  


end