Rails.application.routes.draw do
  get 'current_user', to: 'current_user#index'
  
  devise_for :users, path: '', path_names: {
    sign_in: 'api/v1/login',
    sign_out: 'api/v1/logout',
    registration: 'api/v1/signup'
  },
  controllers: {
    sessions: 'api/v1/sessions',
    registrations: 'api/v1/registrations'
  }

  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      get 'users/current', to: 'users#current'
      resources :bars do
        resources :events, only: [:index, :show]
      end
      resources :beers do
        resources :reviews, only: [:index, :create] 
      end
      
      resources :events do
        member do
          post 'check_in' 
          get 'attendees' 
        end
      end
      resources :users do
        member do
          get 'friendships'
          post 'friendships'
        end
        collection do
          get 'search'
        end
        resources :reviews, only: [:index]
      end
      
      resources :reviews, only: [:index, :show, :create, :update, :destroy]
    end
  end
end