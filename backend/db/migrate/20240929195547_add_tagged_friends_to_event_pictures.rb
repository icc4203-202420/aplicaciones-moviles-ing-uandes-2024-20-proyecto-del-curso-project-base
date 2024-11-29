class AddTaggedFriendsToEventPictures < ActiveRecord::Migration[7.0]
  def change
    add_column :event_pictures, :tagged_friends, :jsonb, default: [], null: false
  end
end
