class RemoveUniqueConstrainOnTags < ActiveRecord::Migration[7.1]
  def change
    remove_index :tags, [:event_picture_id, :user_id]
  end
end
