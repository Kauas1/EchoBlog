

module.exports = async function (req, res, next) { 
  // 401 Unauthorized
  const user = await User.findOne({ where: { id : req.user.id}})
  if(user.role === 'moderator') 
    return true;
  return false;
}