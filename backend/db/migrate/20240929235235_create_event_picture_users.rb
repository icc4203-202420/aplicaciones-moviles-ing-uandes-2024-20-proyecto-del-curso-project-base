class CreateEventPictureUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :event_picture_users do |t|
      t.references :event_picture, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
    add_index :event_picture_users, [:event_picture_id, :user_id], unique: true
  end
end
