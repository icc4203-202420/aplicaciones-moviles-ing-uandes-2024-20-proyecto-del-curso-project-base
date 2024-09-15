Rails.application.routes.draw do
  # devise_for :users
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
  
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
      resources :bars
      get 'current_user', to: 'users#current'
      resources :beers do
        resources :reviews, only: [:index, :create]
      end
      resources :events do
        member do
          post 'mark_assistance'
        end
      end
      resources :users, only: [:index, :show, :create, :update] do
        get 'friendships', on: :member
        post 'friendships', on: :member
        resources :reviews, only: [:index, :create]
      end
      
      resources :reviews, only: [:index, :show, :create, :update, :destroy]
    end
  end

end
