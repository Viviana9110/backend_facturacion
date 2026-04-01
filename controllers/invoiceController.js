import Client from "../models/Client.js";
import Product from "../models/Product.js";
import Invoice from "../models/Invoice.js";
import { createFactusInvoice } from "../service/factusService.js";

export const createInvoice = async (req, res) => {
  try {
    const { clientId, items } = req.body;

    // 🔥 1. Cliente
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ msg: "Cliente no encontrado" });
    }

    let subtotal = 0;

    // 🔥 2. Productos → FACTUS format
    const factusItems = [];
    const dbItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) continue;

      subtotal += product.price * item.quantity;

      factusItems.push({
        code_reference: product._id.toString(),
        name: product.name,
        quantity: item.quantity,
        price: product.price,
        tax_rate: 19,

        unit_measure_id: 70,
        standard_code_id: 1,
        tribute_id: 1,
        is_excluded: 0,
        discount_rate: 0
        
      });

      // 🔥 Para MongoDB
      dbItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price
      });
    }

    const tax = subtotal * 0.19;
    const total = subtotal + tax;

    // 🔥 3. Payload completo
    const payload = {
      reference_code: `fact-${Date.now()}`, // 🔥 único
      customer: {
        identification: "123456789", // ⚠️ mejor guardarlo en DB
        identification_document_id: 1,
        names: client.name,
        address: "N/A",
        email: client.email,
        phone: client.phone
      },
      items: factusItems
    };
    console.log(payload.customer);

    // 🔥 4. Enviar a FACTUS
    const factusResponse = await createFactusInvoice(payload);

    const bill = factusResponse?.data?.bill;

     // 🔥 GUARDAR EN MONGODB
    const newInvoice = new Invoice({
      client: client._id,
      items: dbItems,
      subtotal,
      tax,
      total,
      factusId: bill?.id || null,
      referenceCode: payload.reference_code,

      dianNumber: bill?.number || "",
  qrCode: bill?.qr_image || "",
  publicUrl: bill?.public_url || ""
    });

    await newInvoice.save()

    res.json({
      msg: "Factura creada correctamente",
      factus: factusResponse,
      invoice: newInvoice
    });

  } catch (error) {
    console.error(error.response?.data || error.message);

    res.status(500).json({
      msg: "Error creando factura",
      error: error.response?.data || error.message
    });
  }
};

export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate("client") // 🔥 importante
      .populate("items.product") // 🔥 trae productos también
      .sort({ createdAt: -1 });

    res.json(invoices);
  } catch (error) {
    res.status(500).json({
      msg: "Error obteniendo facturas"
    });
  }
};

export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate("client")
      .populate("items.product");

    if (!invoice) {
      return res.status(404).json({ msg: "Factura no encontrada" });
    }

    res.json(invoice);
  } catch (error) {
    res.status(500).json({
      msg: "Error obteniendo factura"
    });
  }
};