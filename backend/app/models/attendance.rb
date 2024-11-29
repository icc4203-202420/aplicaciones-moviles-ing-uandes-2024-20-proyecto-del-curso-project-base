class Attendance < ApplicationRecord
  belongs_to :user
  belongs_to :event

  def check_in
    # update(checked_in: true)
    self.checked_in = true
    save
  end
end
