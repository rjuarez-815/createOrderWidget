<template>
  <v-card class="pa-6 mx-auto" elevation="4" max-width="1100">
    <v-card-subtitle>
      Review and confirm Lead and Storage details before creating the Order
    </v-card-subtitle>

    <v-divider class="mb-6" />

    <!-- 🔴 ref added for validation -->
    <v-form ref="form" @submit.prevent="createOrderHandleSubmit">
      <v-row dense>

        <!-- ================= Lead Information ================= -->
        <v-col cols="12">
          <div class="section-title">Lead Information</div>
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field label="First Name" v-model="form.First_Name" outlined dense />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field label="Last Name" v-model="form.Last_Name" outlined dense />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field label="Phone" v-model="form.Phone" outlined dense />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field label="Email" v-model="form.Email" outlined dense />
        </v-col>

        <v-col cols="12">
          <v-select
            label="University"
            :items="universities"
            item-text="label"
            item-value="value"
            v-model="form.Lead_University"
            outlined
            dense
          />
        </v-col>

        <!-- ================= Move & Delivery ================= -->
        <v-col cols="12">
          <div class="section-title mt-6">Move & Delivery</div>
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            type="date"
            label="Move Out Date"
            v-model="form.Move_Out_Date"
            outlined
            dense
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            label="Delivery Address"
            v-model="form.Delivery_Address"
            outlined
            dense
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field label="City" v-model="form.City" outlined dense />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field label="Zip Code" v-model="form.Zip_Code" outlined dense />
        </v-col>

        <!-- ================= Storage Items ================= -->
        <v-col cols="12">
          <div class="section-title mt-6">Storage Items</div>
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            type="number"
            label="Number of Bins"
            v-model.number="form.No_of_Bins"
            outlined
            dense
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            type="number"
            label="Loose Items"
            v-model.number="form.No_of_Loose_Items"
            outlined
            dense
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            label="Total Items"
            :value="totalItems"
            readonly
            outlined
            dense
          />
        </v-col>

        <!-- ================= Pricing ================= -->
        <v-col cols="12">
          <div class="section-title mt-6">Pricing</div>
        </v-col>

        <v-col cols="12" md="6">
          <v-select
            label="Pricing Type"
            :items="['Manual', 'Auto']"
            v-model="pricingType"
            outlined
            dense
          />
        </v-col>

        <v-col cols="12" md="6" v-if="pricingType === 'Manual'">
          <v-text-field
            type="number"
            label="Price per Item"
            v-model.number="pricePerItem"
            outlined
            dense
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            label="Estimated Total Price"
            :value="estimatedTotalPrice"
            readonly
            outlined
            dense
          />
        </v-col>

        <!-- ================= Billing ================= -->
        <v-col cols="12">
          <div class="section-title mt-6">Billing</div>
        </v-col>

        <!-- ✅ REQUIRED FIELD (visual + logic) -->
        <v-col cols="12" md="6">
          <v-select
            label="Send Billing *"
            :items="['Yes', 'No', 'Select']"
            v-model="sendBillingLocal"
            outlined
            dense
            required
            persistent-hint
            hint="Required"
            :rules="[v => !!v || 'Send Billing is required']"
          />
        </v-col>

      </v-row>

      <v-divider class="my-6" />

      <v-btn color="primary" block large type="submit">
        Convert to Order
      </v-btn>
    </v-form>
  </v-card>
</template>

<script>
export default {
  name: "CreateOrder",

  props: {
    lead: { type: Object, required: true },
    sendBilling: { type: String, default: 'Select' },
    universities: { type: Array, default: () => [] }
  },

  data() {
    return {
      form: {
        ...this.lead,
        City: this.lead.City || "",
        Zip_Code: this.lead.Zip_Code || ""
      },

      // 🔴 required, no default
      sendBillingLocal:  this.sendBilling,

      pricingType: "Manual",
      pricePerItem: null,
      estimatedTotalPrice: 0
    };
  },

  computed: {
    totalItems() {
      return (
        Number(this.form.No_of_Bins || 0) +
        Number(this.form.No_of_Loose_Items || 0)
      );
    }
  },

  watch: {
    sendBillingLocal(val) {
      this.$emit("update:sendBilling", val);
    },
    totalItems: "calculatePricing",
    pricePerItem: "calculatePricing",
    pricingType: "calculatePricing"
  },

  methods: {
    calculatePricing() {
      if (this.pricingType === "Manual") {
        this.estimatedTotalPrice =
          (this.pricePerItem || 0) * this.totalItems;
      } else {
        const price = this.pricingTable(this.totalItems);
        this.pricePerItem = price;
        this.estimatedTotalPrice = price * this.totalItems;
      }
    },

    pricingTable(totalItems) {
      if (totalItems <= 2) return 22.5;
      if (totalItems <= 5) return 20;
      if (totalItems <= 10) return 18;
      return 15;
    },

    createOrderHandleSubmit() {
      // 🔴 VALIDATION TRIGGER
      if (!this.$refs.form.validate()) return;

      this.$emit("submit", {
        ...this.form,
        Total_Item_Count: this.totalItems,
        Price_per_Item: this.pricePerItem || 0,
        Estimated_Price: this.estimatedTotalPrice || 0,
        Lead_Type: this.form.Lead_Type || "Student Storage"
      });
    }
  }
};
</script>

<style scoped>
.section-title {
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #555;
}
</style>
