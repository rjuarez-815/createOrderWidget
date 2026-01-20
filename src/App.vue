<template>
  <v-app>
    <v-main class="pa-4">

      <!-- ================= FORM VIEW ================= -->
      <createOrder
        v-if="leadLoaded && !orderCreated"
        :lead="leadData"
        :send-billing.sync="sendBilling"
        @submit="handleSubmit"
      />

      <!-- ================= SUCCESS VIEW ================= -->
      <v-card
        v-if="orderCreated"
        class="pa-6 text-center"
        elevation="3"
      >
        <v-icon color="success" size="56" class="mb-3">
          mdi-check-circle
        </v-icon>

        <h3 class="mb-2">Order Created!</h3>
        <p class="mb-6">Opening order...</p>
      </v-card>

    </v-main>
  </v-app>
</template>

<script>
import createOrder from "./components/createOrder.vue";

export default {
  name: "App",
  components: { createOrder },

  data() {
    return {
      leadId: null,
      leadData: null,
      leadLoaded: false,

      sendBilling: "No",

      orderCreated: false,
      createdOrderId: null,
      createdCustomerId: null
    };
  },

  mounted() {
    /* eslint-disable */
    ZOHO.embeddedApp.on("PageLoad", async (data) => {
      try {
        this.leadId = Array.isArray(data.EntityId)
          ? data.EntityId[0]
          : data.EntityId;

        const res = await ZOHO.CRM.API.getRecord({
          Entity: "Leads",
          RecordID: this.leadId
        });

        this.leadData = res.data[0];
        this.leadLoaded = true;

        console.log("[INIT] Lead loaded:", this.leadData);
      } catch (err) {
        console.error("[INIT] Lead load failed:", err);
        alert("Failed to load Lead record.");
      }
    });

    ZOHO.embeddedApp.init();
  },

  methods: {
    async handleSubmit(formData) {
      try {
        console.log("[SUBMIT] Submit started");

        const payload = {
          leadId: this.leadId,
          leadType: formData.Lead_Type || "Student Storage",
          send_billing: this.sendBilling,
          confirmedBy: this.leadData?.Owner?.id || null,
          confirmedAt: new Date().toISOString(),
          orderDetails: formData
        };

        console.log("[SUBMIT] Widget payload:", payload);

        // ================= PHASE 3 =================
        const resp = await ZOHO.CRM.FUNCTIONS.execute(
          "convertLeadtoCustomerOrder_Standalone",
          { arguments: JSON.stringify(payload) }
        );

        const result = JSON.parse(resp.details.output);
        console.log("[PHASE 3] Result:", result);

        if (result.status !== "success") {
          throw new Error(result.message || "Order creation failed");
        }

        this.createdOrderId = result.orderId;
        this.createdCustomerId = result.customerId;
        this.orderCreated = true;

        console.log(
          "[PHASE 3] Stored IDs:",
          this.createdOrderId,
          this.createdCustomerId
        );

        // ================= PHASE 4 =================
        if (this.sendBilling === "Yes") {
          if (!this.createdCustomerId) {
            throw new Error("Missing customerId for billing");
          }

          const billingPayload = {
            order: {
              id: this.createdOrderId,
              customer_id: this.createdCustomerId,
              Number_of_loos_items: formData.Number_of_loos_items || 0,
              Number_of_bins: formData.Number_of_bins || 0
            }
          };

          console.log(
            "[PHASE 4] Billing payload:",
            billingPayload
          );

          const billingResp = await ZOHO.CRM.FUNCTIONS.execute(
            "createZBillingSubscription",
            { arguments: JSON.stringify(billingPayload) }
          );

          console.log(
            "[PHASE 4] Billing response:",
            billingResp
          );
        }

        // ================= NAV =================
        setTimeout(() => {
          window.open(
            `https://crm.zoho.com/crm/juujbox/tab/CustomModule19/${this.createdOrderId}`,
            "_blank"
          );
        }, 1000);

      } catch (err) {
        console.error("[SUBMIT] Error:", err);
        alert(err.message || "Error creating order");
      }
    }
  }
};
</script>
