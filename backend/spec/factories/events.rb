FactoryBot.define do
  factory :event do
    name { "MyString" }
    description { "MyText" }
    # date { "2024-08-09 09:44:49" }
    # bar { nil }
    start_date { Faker::Date.forward(days: rand(1..30)) }  # Fecha de inicio aleatoria dentro de los próximos 30 días
    end_date { Faker::Date.forward(days: rand(31..60)) }   # Fecha de fin aleatoria entre 31 y 60 días a partir de hoy
    bar { association :bar }
  end
end
