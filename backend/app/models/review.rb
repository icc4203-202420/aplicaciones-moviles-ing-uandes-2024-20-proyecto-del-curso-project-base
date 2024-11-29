class Review < ApplicationRecord
  belongs_to :user
  belongs_to :beer

  after_save :update_beer_rating
  after_destroy :update_beer_rating
  after_create_commit :broadcast_review

  private

  def broadcast_review
    ActionCable.server.broadcast(
      "feed_channel",
      {
        id: id,
        text: text,
        rating: rating,
        user: { id: user.id, name: user.handle },
        beer: { id: beer.id, name: beer.name },
        created_at: created_at.strftime("%Y-%m-%d %H:%M:%S")
      }
    )
  end

  def update_beer_rating
    beer.update_avg_rating
  end

end