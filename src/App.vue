<template>
  <v-app>
    <v-main class="pa-4">

      <!-- ================= STUDENT STORAGE ================= -->
      <createOrder
        v-if="isStudentStorageFormVisible"
        :lead="leadData"
        :universities="universities"
        :send-billing.sync="sendBilling"
        @submit="createOrderHandleSubmit"
      />

      <!-- ================= MOVING BOX RENTAL ================= -->
      <createOrderMBO
        v-if="isMBRFormVisible"
        :lead="leadData"
        :send-billing.sync="sendBilling"
        @submit="createOrderHandleSubmit"
      />

      <!-- ================= SUCCESS VIEW ================= -->
      <v-card v-if="orderCreated" class="pa-6 text-center" elevation="3">
        <v-icon color="success" size="56" class="mb-3">
          mdi-check-circle
        </v-icon>
        <h3 class="mb-2">Order Created!</h3>
        <p class="mb-6">Opening order...</p>
      </v-card>

      <!-- ================= FALLBACK VIEW ================= -->
      <v-card
        v-if="leadLoaded && !orderCreated && !isSupportedLeadType"
        class="pa-6 text-center"
        elevation="3"
      >
        <v-icon color="warning" size="48" class="mb-3">
          mdi-alert-circle
        </v-icon>
        <h3>Unsupported Lead Type</h3>
        <p>
          Lead Type <strong>{{ leadType }}</strong> is not supported.
        </p>
      </v-card>

    </v-main>
  </v-app>
</template>

<script>
import createOrder from "./components/createOrder.vue";
import createOrderMBO from "./components/createOrderMBO.vue";

export default {
  name: "App",
  components: {
    createOrder,
    createOrderMBO
  },

  data() {
    return {
      leadId: null,
      leadData: null,
      leadLoaded: false,
      leadType: null,

      universities: [],
      sendBilling: 'Select', // MUST be blank by default

      orderCreated: false,
      createdOrderId: null,
      createdCustomerId: null
    };
  },

  computed: {
    isStudentStorageFormVisible() {
      return (
        this.leadLoaded &&
        !this.orderCreated &&
        this.leadType === "Student Storage"
      );
    },

    isMBRFormVisible() {
      return (
        this.leadLoaded &&
        !this.orderCreated &&
        this.leadType === "Moving Box Rental"
      );
    },

    isSupportedLeadType() {
      return ["Student Storage", "Moving Box Rental"].includes(this.leadType);
    }
  },

  mounted() {
    /* eslint-disable */
    this.initializeZohoWidget();
  },

  methods: {
    /* ================= INIT ================= */

    initializeZohoWidget() {
      ZOHO.embeddedApp.on("PageLoad", this.handlePageLoad);
      ZOHO.embeddedApp.init();
    },

    async handlePageLoad(data) {
      this.leadId = Array.isArray(data.EntityId)
        ? data.EntityId[0]
        : data.EntityId;

      const response = await ZOHO.CRM.API.getRecord({
        Entity: "Leads",
        RecordID: this.leadId
      });

      this.leadData = response.data[0];
      this.leadType = this.leadData?.Lead_Type || null;
      this.leadLoaded = true;

      await this.fetchUniversities();
    },

    async fetchUniversities() {
      const response = await ZOHO.CRM.API.getAllRecords({
        Entity: "Universities",
        page: 1,
        per_page: 200
      });

      this.universities = (response.data || []).map(u => ({
        label: u.Name,
        value: u.id
      }));
    },

    /* ================= ORDER CREATION ================= */

    async createOrderHandleSubmit(orderDetails) {
      try {
        const payload = {
          leadId: this.leadId,
          leadType: this.leadType,
          send_billing: this.sendBilling,
          confirmedBy: this.leadData?.Owner?.id || null,
          confirmedAt: new Date().toISOString(),
          orderDetails
        };

        const response = await ZOHO.CRM.FUNCTIONS.execute(
          "convertLeadtoCustomerOrder_Standalone",
          { arguments: JSON.stringify(payload) }
        );

        const result = JSON.parse(response.details.output);
        if (result.status !== "success") {
          throw new Error(result.message);
        }

        this.createdOrderId = result.orderId;
        this.createdCustomerId = result.customerId;
        this.orderCreated = true;

        /* ================= BILLING LOGIC ================= */

        if (this.sendBilling === "Yes") {
          if (this.leadType === "Student Storage") {
            await this.createBillingSubscription(orderDetails);
          }

          if (this.leadType === "Moving Box Rental") {
            await this.createMBRBillingInvoice(orderDetails); // ✅ Option A fix
          }
        }

        setTimeout(() => {
          ZOHO.CRM.UI.Record.open({
            Entity: "Orders",
            RecordID: this.createdOrderId
          });
        }, 1000);

      } catch (err) {
        alert(err.message || "Order creation failed");
      }
    },

/* ================= ORDER CREATION ================= */

async createOrderHandleSubmit(orderDetails) {
  try {
    console.log("===== SUBMIT TRIGGERED =====");
    console.log("Lead ID:", this.leadId);
    console.log("Lead Type:", this.leadType);
    console.log("Send Billing:", this.sendBilling);
    console.log("Order Details:", orderDetails);

    const payload = {
      leadId: this.leadId,
      leadType: this.leadType,
      send_billing: this.sendBilling,
      confirmedBy: this.leadData?.Owner?.id || null,
      confirmedAt: new Date().toISOString(),
      orderDetails
    };

    const response = await ZOHO.CRM.FUNCTIONS.execute(
      "convertLeadtoCustomerOrder_Standalone",
      { arguments: JSON.stringify(payload) }
    );

    console.log("Order creation response:", response);

    const result = JSON.parse(response.details.output);
    if (result.status !== "success") {
      throw new Error(result.message);
    }

    this.createdOrderId = result.orderId;
    this.createdCustomerId = result.customerId;
    this.orderCreated = true;

    /* ================= BILLING LOGIC ================= */
    console.log("Checking if billing should be created...");
    if (this.sendBilling === "Yes") {
      if (this.leadType === "Student Storage") {
        console.log("Triggering createBillingSubscription...");
        await this.createBillingSubscription(orderDetails);
      }

      if (this.leadType === "Moving Box Rental") {
        console.log("Triggering createMBRBillingInvoice...");
        await this.createMBRBillingInvoice(orderDetails);
      }
    } else {
      console.log("Billing not triggered (sendBilling != 'Yes')");
    }

    setTimeout(() => {
      ZOHO.CRM.UI.Record.open({
        Entity: "Orders",
        RecordID: this.createdOrderId
      });
    }, 1000);

  } catch (err) {
    console.error("Order creation failed:", err);
    alert(err.message || "Order creation failed");
  }
},

/* ================= STUDENT STORAGE BILLING ================= */

async createBillingSubscription(orderDetails) {
  try {
    console.log("===== createBillingSubscription CALLED =====");
    console.log("Created Order ID:", this.createdOrderId);
    console.log("Created Customer ID:", this.createdCustomerId);
    console.log("Order Details Payload:", orderDetails);

    const billingPayload = {
      order: {
        id: this.createdOrderId,
        customer_id: this.createdCustomerId,
        Number_of_bins: orderDetails.No_of_Bins || 0,
        Number_of_loose_items: orderDetails.No_of_Loose_Items || 0
      },
      orderDetails
    };

    console.log("Final billing payload sent to Zoho:", billingPayload);

    const response = await ZOHO.CRM.FUNCTIONS.execute(
      "createZBillingSubscription",
      { arguments: JSON.stringify(billingPayload) }
    );

    console.log("Billing function response:", response);
  } catch (e) {
    console.error("Billing function error:", e);
  }
},


    /* ================= MBR BILLING (INVOICE ONLY) ================= */

    async createMBRBillingInvoice(orderDetails) {
      const payload = {
        orderId: this.createdOrderId,
        orderDetails // ✅ Option A: pass full orderDetails
      };

      await ZOHO.CRM.FUNCTIONS.execute(
        "createZBillingInvoice",
        { arguments: JSON.stringify(payload) }
      );
    }
  }
};
</script>
