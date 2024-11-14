Rails.application.routes.draw do
  # Routes for user authentication (Devise)
  devise_for :users, path: '', path_names: {
    sign_in: 'api/v1/login',
    sign_out: 'api/v1/logout',
    registration: 'api/v1/signup'
  },
  controllers: {
    sessions: 'api/v1/sessions',
    registrations: 'api/v1/registrations'
  }

  # Health check route
  get "up" => "rails/health#show", as: :rails_health_check

  # Namespaced routes for the API
  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      resources :bars do
        resources :events do
          resources :attendances, only: [:create, :index] # POST for checking in
          resources :event_pictures, only: [:create, :index, :show]
          delete 'attendances/:user_id', to: 'attendances#destroy', as: 'attendance_destroy'
          get 'attendees', on: :member # GET for listing attendees
        end
      end

      # Removed the separate resources :events declaration since it's nested
      # You can access events through bars, e.g. GET /api/v1/bars/:bar_id/events/:id

      resources :events, only: [:index, :show]

      resources :beers do
        member do
          get :bars # Get bars where the beer is available
        end
      end

      resources :users do
        resources :reviews, only: [:index, :show, :create, :update, :destroy]

        collection do #nuevo
          get 'search', to: 'users#search'
        end

        

        member do
          get 'friends', to: 'users#friends'
        end
      end

      resources :reviews, only: [:index, :show, :create, :update, :destroy]
      resources :friendships, only: [:index, :create, :destroy] do
        member do
          put 'accept'
          put 'decline'
        end
      end
    end
  end
end
