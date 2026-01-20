<template>
  <v-card
    class="pa-6 mx-auto"
    elevation="4"
    max-width="1100"
  >
    <v-card-subtitle class="pb-4">
      Review and confirm Lead and Storage details before creating the Order
    </v-card-subtitle>

    <v-divider class="mb-6" />

    <v-form @submit.prevent="submit">
      <v-row dense>
        <!-- ================= Lead Info ================= -->
        <v-col cols="12">
          <div class="section-title">Lead Information</div>
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            label="First Name"
            v-model="form.First_Name"
            outlined
            dense
            required
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            label="Last Name"
            v-model="form.Last_Name"
            outlined
            dense
            required
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            label="Phone"
            v-model="form.Phone"
            outlined
            dense
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            label="Email"
            v-model="form.Email"
            outlined
            dense
          />
        </v-col>

        <v-col cols="12">
          <v-text-field
            label="University"
            v-model="form.Lead_University"
            outlined
            dense
          />
        </v-col>

        <!-- ================= Move & Address ================= -->
        <v-col cols="12">
          <div class="section-title mt-6">Move & Delivery Details</div>
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
          <v-text-field
            label="City"
            v-model="form.City"
            outlined
            dense
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            label="Zip Code"
            v-model="form.Zip_Code"
            outlined
            dense
          />
        </v-col>

        <!-- ================= Item Counts ================= -->
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
            type="number"
            label="Total Items"
            v-model.number="form.Total_Item_Count"
            outlined
            dense
          />
        </v-col>

        <!-- ================= Pricing ================= -->
        <v-col cols="12">
          <div class="section-title mt-6">Pricing</div>
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            type="number"
            label="Price per Item"
            v-model.number="form.Price_per_Item"
            outlined
            dense
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            type="number"
            label="Estimated Total Price"
            v-model.number="form.Estimated_Price"
            outlined
            dense
          />
        </v-col>

        <!-- ================= Billing ================= -->
        <v-col cols="12">
          <div class="section-title mt-6">Billing</div>
        </v-col>

        <v-col cols="12" md="6">
          <v-select
            label="Send Billing"
            :items="['Yes', 'No']"
            v-model="sendBillingLocal"
            outlined
            dense
          />
        </v-col>
      </v-row>

      <v-divider class="my-6" />

      <!-- Action -->
      <v-btn
        color="primary"
        large
        block
        type="submit"
        elevation="2"
      >
        Convert to Order
      </v-btn>
    </v-form>
  </v-card>
</template>

<script>
export default {
  name: "createOrder",

  props: {
    lead: { type: Object, required: true },
    sendBilling: { type: String, default: "No" }
  },

  data() {
    return {
      form: { ...this.lead },
      sendBillingLocal: this.sendBilling
    };
  },

  watch: {
    sendBillingLocal(val) {
      this.$emit("update:sendBilling", val);
    }
  },

  methods: {
    submit() {
      this.$emit("submit", this.form);
    }
  }
};
</script>

<style scoped>
.section-title {
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #555;
}
</style>
