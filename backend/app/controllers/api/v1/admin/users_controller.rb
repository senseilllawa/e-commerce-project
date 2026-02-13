module Api
  module V1
    module Admin
      class UsersController < BaseController
        before_action :authorize_admin!
        before_action :set_user, only: [:show, :update, :destroy]

        # GET /api/v1/admin/users
        def index
          @users = User.all.order(created_at: :desc).page(params[:page]).per(params[:per_page] || 20)
          
          render json: {
            users: defined?(UserSerializer) ? 
                   UserSerializer.new(@users).serializable_hash[:data].map { |u| u[:attributes] } : 
                   @users.as_json(except: [:encrypted_password, :remember_created_at]),
            meta: pagination_meta(@users)
          }
        end

        # GET /api/v1/admin/users/:id
        def show
          render json: defined?(UserSerializer) ? 
                 UserSerializer.new(@user).serializable_hash[:data][:attributes] : 
                 @user.as_json(include: :orders)
        end

        # PUT/PATCH /api/v1/admin/users/:id
        def update
          p = user_params.to_h
          if p[:password].blank?
            p.delete(:password)
            p.delete(:password_confirmation)
          end

          if @user.update(p)
            render json: {
              message: 'User updated successfully',
              user: defined?(UserSerializer) ? 
                    UserSerializer.new(@user).serializable_hash[:data][:attributes] : 
                    @user
            }
          else
            render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
          end
        end

        # DELETE /api/v1/admin/users/:id
        def destroy
          if @user.id == current_user.id
            render json: { error: 'You cannot delete yourself' }, status: :forbidden
          elsif @user.destroy
            render json: { message: 'User deleted successfully' }
          else
            render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
          end
        end

        private

        def set_user
          @user = User.find(params[:id])
        end

        def user_params
          params.require(:user).permit(:first_name, :last_name, :email, :role, :password, :password_confirmation)
        end
      end
    end
  end
end