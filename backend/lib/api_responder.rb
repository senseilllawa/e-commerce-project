class ApiResponder < ActionController::Responder
  def to_json
    options[:location] = nil
    super
  end
end