let users = [
  { id: 1, name: "Anh Tho" },
  { id: 2, name: "Group13 Member" },
];

// GET /users
const getUsers = (req, res) => {
  res.json(users);
};

// POST /users
const addUser = (req, res) => {
  const newUser = req.body;
  newUser.id = users.length + 1;
  users.push(newUser);
  res.status(201).json(newUser);
};

module.exports = { getUsers, addUser };
