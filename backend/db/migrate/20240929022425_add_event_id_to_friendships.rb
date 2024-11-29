class AddEventIdToFriendships < ActiveRecord::Migration[7.1]
  def change
    add_column :friendships, :event_id, :integer, null: true
    add_foreign_key :friendships, :events
  end
end
