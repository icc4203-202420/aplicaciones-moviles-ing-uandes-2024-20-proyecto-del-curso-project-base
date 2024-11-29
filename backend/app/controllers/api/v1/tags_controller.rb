class API::V1::TagsController < ApplicationController
  def index
    @tags = Tag.all
    render json: { tags: @tags }, status: :ok
  end

  def show
    @tag = Tag.find_by(id: params[:id])
    render json: { tag: @tag }, status: :ok
  end

  def create
    @tag = Tag.new(tag_params)
    if @tag.save
      render json: { tag: @tag, message: 'Tag created successfully.' }, status: :ok
    else
      render json: @tag.errors, status: :unprocessable_entity
    end
  end

  def update
    @tag = Tag.find_by(id: params[:id])
    if @tag.update(tag_params)
      render json: { tag: @tag, message: 'Tag updated successfully.' }, status: :ok
    else
      render json: @tag.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @tag = Tag.find_by(id: params[:id])
    if @tag.destroy
      render json: { message: 'Tag successfully deleted.' }, status: :no_content
    else
      render json: @tag.errors, status: :unprocessable_entity
    end
  end

  private

  def tag_params
    params.require(:tag).permit(:event_picture_id, :user_id, :tagged_user_id)
  end
end