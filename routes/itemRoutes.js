const express = require('express');
const router = express.Router();
const { isAuth } = require('../services/middleware');;
const Item = require('../models/Item');

// Rota para exibir o formulário de criação de um novo item
router.get('/create', isAuth, (req, res) => {
  res.render('create');
});

// Rota para processar o envio do formulário e criar um novo item
router.post('/create', isAuth, async (req, res) => {
  try {
    // Verificar se o usuário está autenticado
    if (!req.user) {
      return res.redirect('/login');
    }

    // Extrair os dados do formulário
    const { title, description, date } = req.body;

    // Criar o novo item
    const newItem = {
      title,
      description,
      date,
      createdBy: req.user.googleId, // Armazenar o ID do usuário que criou o item
    };

    // Salvar o novo item no banco de dados
    await Item.create(newItem);
    res.redirect('/list');
  } catch (err) {
    console.error(err);
    res.redirect('/error');
  }
});


// Rota para listar todos os itens de um utilizador
router.get('/list', isAuth, async (req, res) => {
  try {
    const itemCollection = await Item.find({ createdBy: req.user.googleId });
    res.render('list', { items: itemCollection });
  } catch (err) {
    console.error(err);
    res.redirect('/error');
  }
});

// // Rota para processar o envio do formulário e criar um novo item
// router.post('/create', async (req, res) => {
//   // Verificar se o usuário está autenticado
//   if (!req.user) {
//     return res.redirect('/login');
//   }

//   // Extrair os dados do formulário
//   const { title, description, date } = req.body;

//   // Criar o novo item
//   const newItem = {
//     title,
//     description,
//     date,
//     createdBy: req.user.googleId, // Armazenar o ID do usuário que criou o item
//   };

//   // Salvar o novo item no banco de dados
//   await Item.create(newItem);
//   res.redirect('/list');
// });
// Rota para exibir um item específico
router.get('/:itemId', async (req, res) => {
  // Verificar se o usuário está autenticado
  if (!req.user) {
    return res.redirect('/login');
  }

  try {
    const item = await Item.findOne({
      _id: req.params.itemId,
      createdBy: req.user.googleId,
    });

    if (!item) {
      return res.redirect('/error');
    }

    res.render('item', { item });
  } catch (err) {
    console.error(err);
    res.redirect('/error');
  }
});

// Rota para excluir um item específico
router.post('/delete/:id', async (req, res) => {
  // Verificar se o usuário está autenticado
  if (!req.user) {
    return res.redirect('/login');
  }
  // res.json("Delete item")

  try {
    await Item.findOneAndRemove({
      _id: req.params.id,
      createdBy: req.user.googleId,
    });
    res.redirect('/list');
  } catch (err) {
    console.error(err);
    res.redirect('/error');
  }
});


// Rota para exibir o formulário de edição do item
router.get('/edit/:id', async (req, res) => {
  // Verificar se o usuário está autenticado
  if (!req.user) {
    return res.redirect('/login');
  }
  try {
    const itemId = req.params.id;
    const item = await Item.findById(itemId);
    res.render('edit', { item });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao carregar o formulário de edição do item');
  }
});

// Rota para atualizar o item no banco de dados
router.post('/edit/:id', async (req, res) => {
  // Verificar se o usuário está autenticado
  if (!req.user) {
    return res.redirect('/login');
  }
  try {
    const itemId = req.params.id;
    const updatedItemData = {
      title: req.body.title,
      description: req.body.description,
      date: req.body.date
    };
    const updatedItem = await Item.findByIdAndUpdate(itemId, updatedItemData, { new: false });
    res.redirect('/list');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao atualizar o item');
  }
});

module.exports = router;
