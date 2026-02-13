module Api
  module V1
    class ProfileController < BaseController
      # GET /api/v1/profile
      def show
        render json: UserSerializer.new(current_user).serializable_hash[:data][:attributes]
      end

      # PUT/PATCH /api/v1/profile
      def update
        if current_user.update(profile_params)
          render json: {
            message: 'Profile updated successfully',
            user: UserSerializer.new(current_user).serializable_hash[:data][:attributes]
          }
        else
          render json: { errors: current_user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def profile_params
        params.require(:user).permit(:first_name, :last_name, :email, :password, :password_confirmation, :current_password)
      end
    end
  end
end
