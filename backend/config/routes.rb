Rails.application.routes.draw do
  # devise_for :users
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
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


  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"

  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      resources :bars do
        resources :events
      end

      resources :events do
        collection do
          get 'all_events', to: 'events#all_events'  
        end
      end

      resources :beers do
        resources :reviews, only: [:index, :create, :show]
      end
      resources :users do
        collection do
          post 'update_push_token', to: 'users#update_push_token'
        end
        resources :reviews, only: [:index]
        resources :friendships, param: :friend_id, only: [:index, :create, :show, :update]
      end

      resources :reviews, only: [:index, :show, :create, :update, :destroy]
      resources :countries, only: [:index]
      resources :events do
        resources :event_pictures, only: [:new, :create]
      end

      resources :event_pictures, only: [:new, :create]
      resources :attendances
    end
  end

end


#
