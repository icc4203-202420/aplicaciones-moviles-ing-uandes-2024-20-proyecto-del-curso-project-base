class RenameEventPictureUserToTag < ActiveRecord::Migration[7.1]
  def change
    rename_table :event_picture_users, :tags
    add_column :tags, :tagged_user_id, :integer
  end
end
