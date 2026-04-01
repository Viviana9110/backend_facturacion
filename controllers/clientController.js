import Client from "../models/Client.js";

export const createClient = async (req, res) => {
  const client = await Client.create(req.body);
  res.json(client);
};

export const getClients = async (req, res) => {
  const clients = await Client.find();
  res.json(clients);
};

export const getClient = async (req, res) => {
  const client = await Client.findById(req.params.id);
  res.json(client);
};

export const updateClient = async (req, res) => {
  const client = await Client.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(client);
};

export const deleteClient = async (req, res) => {
  await Client.findByIdAndDelete(req.params.id);
  res.json({ msg: "Cliente eliminado" });
};