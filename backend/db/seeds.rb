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

  # Crear eventos asociados a los bares con nombres únicos
  events = bars.map.with_index(1) do |bar, i|  
    FactoryBot.create(:event, bar: bar, name: "Event #{i}")
  end

  # Crear relaciones de amistad entre usuarios
  users.combination(2).to_a.sample(5).each do |user_pair|
    FactoryBot.create(:friendship, user: user_pair[0], friend: user_pair[1], event: events.sample)
  end

  # Crear bares con direcciones predeterminadas
  bar1 = FactoryBot.create(:bar, name: "Barbazul las condes", latitude: -33.408432477832065, longitude: -70.55057067362067, address: FactoryBot.create(:address))
  bar2 = FactoryBot.create(:bar, name: "Bar La Virgen Las Condes", latitude:  -33.403468769034426, longitude: -70.57483548297961, address: FactoryBot.create(:address))
  bar3 = FactoryBot.create(:bar, name: "Bar Santiago Vitacura", latitude: -33.3860994490438, longitude:  -70.56505806205678, address: FactoryBot.create(:address))
  bar4 = FactoryBot.create(:bar, name: "Bar Buena Barra", latitude: -33.419678161181764, longitude:  -70.6085334425203, address: FactoryBot.create(:address))
  bar5 = FactoryBot.create(:bar, name: "Insert Coin Bar - Providencia", latitude: -33.42628276959576, longitude:  -70.61784726228368, address: FactoryBot.create(:address))
  bar6 = FactoryBot.create(:bar, name: "Gracielo Bar", latitude: -33.42540608058621, longitude:   -70.61994812388444, address: FactoryBot.create(:address))

  # Crear attendances (asistencia) de usuarios a eventos
  users.each do |user|
    events.sample(rand(1..3)).each do |event|
      FactoryBot.create(:attendance, user: user, event: event, checked_in: [true, false].sample)
    end
  end
end
