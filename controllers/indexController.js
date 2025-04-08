

const getIndexPage = async (req, res) => {
  const users = await prisma.users.findMany();
  console.log(users);
  res.render('index')
};



module.exports = {
  getIndexPage,
}