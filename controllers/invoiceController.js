import Client from "../models/Client.js";
import Product from "../models/Product.js";
import Invoice from "../models/Invoice.js";
import { createFactusInvoice } from "../service/factusService.js";

export const createInvoice = async (req, res) => {
  try {
    const { clientId, items, date, paymentMethod } = req.body;

    if (!clientId) {
      return res.status(400).json({ msg: "Cliente requerido" });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ msg: "Debe agregar productos" });
    }

    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ msg: "Cliente no encontrado" });
    }

    let subtotal = 0;
    const factusItems = [];
    const dbItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) continue;

      const quantity = Number(item.quantity);

      subtotal += product.price * quantity;

      factusItems.push({
        code_reference: product._id.toString(),
        name: product.name,
        quantity,
        price: product.price,
        tax_rate: 19,
        unit_measure_id: 70,
        standard_code_id: 1,
        tribute_id: 1,
        is_excluded: 0,
        discount_rate: 0,
      });

      dbItems.push({
        product: product._id,
        quantity,
        price: product.price,
      });
    }

    const tax = subtotal * 0.19;
    const total = subtotal + tax;

    // ✅ MAPEO CORRECTO
    const paymentMap = {
      Efectivo: { form: "1", method: "10" },
      Transferencia: { form: "1", method: "42" },
      Tarjeta: { form: "1", method: "48" },
      Crédito: { form: "2", method: "10" },
    };

    const selectedPayment =
      paymentMap[paymentMethod] || paymentMap["Efectivo"];

    // ✅ PAYLOAD CORRECTO
    const payload = {
      reference_code: `fact-${Date.now()}`,

      customer: {
        identification: client.identification || "222222222",
        identification_document_id: 1,
        names: client.name,
        address: client.address || "N/A",
        email: client.email,
        phone: client.phone || "0000000000",
      },

      // 🔥 SEPARADOS (CLAVE)
     payment_form: selectedPayment.form,
    payment_method: selectedPayment.method,

      items: factusItems,
    };

    console.log("📤 Payload enviado a Factus:", payload);

    const factusResponse = await createFactusInvoice(payload);
    const bill = factusResponse?.data?.bill;

    console.log("🔥 RESPUESTA FACTUS COMPLETA:");
    console.dir(factusResponse.data, { depth: null });
    console.log(factusResponse.data);

console.log("🔥 BILL:", bill);
console.log("🔥 NUMBER:", bill?.number);

    const qr = bill?.qr_image || "";
const cufe = bill?.cufe || "";
const publicUrl = bill?.public_url || "";

    const newInvoice = new Invoice({
  client: client._id,
  items: dbItems,
  subtotal,
  tax,
  total,
  date: date || new Date(),
  paymentMethod,

  factusId: bill?.id || null,
  referenceCode: payload.reference_code,
  dianNumber: bill?.number || "",
  qrCode: qr,
  cufe: cufe,
  publicUrl: publicUrl,
});

    await newInvoice.save();
    console.log("🔥 NUMBER:", bill?.number);

    res.json({
      msg: "Factura creada correctamente",
      factus: bill,
      invoiceNumber: bill?.number,
      publicUrl: publicUrl,
      invoice: newInvoice,
    });

  } catch (error) {
    console.error(
      "❌ ERROR FACTUS:",
      JSON.stringify(error.response?.data, null, 2) || error.message
    );

    res.status(500).json({
      msg: "Error creando factura",
      error: error.response?.data || error.message,
    });
  }
};
export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate("client")
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json(invoices);
  } catch (error) {
    res.status(500).json({
      msg: "Error obteniendo facturas",
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
      msg: "Error obteniendo factura",
    });
  }
};