<template>
  <v-card class="pa-6 mx-auto" elevation="4" max-width="1100">
    <v-card-subtitle>
      Review and confirm Lead and Storage details before creating the Order
    </v-card-subtitle>

    <v-divider class="mb-6" />

    <v-form ref="form" @submit.prevent="createOrderHandleSubmit">
      <v-row dense>

        <!-- ================= Lead Information ================= -->
        <v-col cols="12">
          <div class="section-title">Lead Information</div>
        </v-col>

        <v-col cols="6">
          <v-text-field label="First Name" v-model="form.First_Name" outlined dense />
        </v-col>

        <v-col cols="6">
          <v-text-field label="Last Name" v-model="form.Last_Name" outlined dense />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field label="Phone" v-model="form.Phone" outlined dense />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field label="Email" v-model="form.Email" outlined dense />
        </v-col>

        <v-col cols="12">
          <v-select label="University" :items="universities" item-text="label" item-value="value"
            v-model="form.Lead_University" outlined dense />
        </v-col>

        <!-- ================= Move Out Details ================= -->
        <v-col cols="12">
          <div class="section-title mt-6">Move Out Details</div>
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field type="date" label="Move Out Date" v-model="form.Move_Out_Date" outlined dense />
        </v-col>

        <v-col cols="6">
          <v-text-field label="Move Out Address" v-model="form.Move_Out_Address" outlined dense />
        </v-col>

        <v-col cols="6" md="4">
          <v-text-field label="Move Out City" v-model="form.Move_Out_City" outlined dense />
        </v-col>

        <v-col cols="6" md="4">
          <v-text-field label="Move Out State" v-model="form.Move_Out_State" outlined dense />
        </v-col>

        <v-col cols="6" md="4">
          <v-text-field label="Move Out ZIP" v-model="form.Move_Out_Zip" outlined dense />
        </v-col>

        <!-- ================= Storage Items ================= -->
        <v-col cols="12">
          <div class="section-title mt-6">Storage Items</div>
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field type="number" label="Number of Bins" v-model.number="form.No_of_Bins" outlined dense />
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field type="number" label="Loose Items" v-model.number="form.No_of_Loose_Items" outlined dense />
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field label="Total Items" :value="totalItems" readonly outlined dense />
        </v-col>

        <!-- ================= Empty Bin Drop-Off ================= -->
        <template v-if="form.No_of_Bins > 0">
          <v-col cols="12">
            <div class="section-title mt-6">Empty Bin Drop-Off</div>
          </v-col>

          <v-col cols="12">
            <v-checkbox label="Skip Empty Bin Drop-Off Details" v-model="skipEmptyBinDropOff" />
          </v-col>

          <template v-if="!skipEmptyBinDropOff">
            <v-col cols="12" md="6">
              <v-text-field type="date" label="Bin Drop-Off Date" v-model="form.Empty_Bin_Drop_Off_Date"
                :rules="[requiredRule]" outlined dense />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field label="Bin Drop-Off Address" v-model="form.Empty_Bin_Drop_Off_Address"
                :rules="[requiredRule]" outlined dense />
            </v-col>

            <v-col cols="6">
              <v-text-field label="City" v-model="form.Empty_Bin_Drop_Off_City" :rules="[requiredRule]" outlined
                dense />
            </v-col>

            <v-col cols="6">
              <v-text-field label="State" v-model="form.Empty_Bin_Drop_Off_State" :rules="[requiredRule]" outlined
                dense />
            </v-col>

            <v-col cols="6">
              <v-text-field label="ZIP" v-model="form.Empty_Bin_Drop_Off_Zip" :rules="[requiredRule]" outlined dense />
            </v-col>
            <v-col cols="6">
              <v-text-field label="Time Window" v-model="form.Empty_Bin_Drop_Off_Time_Window" :rules="[requiredRule]"
                outlined dense />
            </v-col>
          </template>
        </template>

        <!-- ================= Pricing ================= -->
        <v-col cols="12">
          <div class="section-title mt-6">Pricing</div>
        </v-col>

        <v-col cols="12" md="4">
          <v-checkbox label="Custom Pricing" v-model="form.Custom_Pricing" />
        </v-col>

        <v-col cols="6" v-if="form.Custom_Pricing">
          <v-text-field type="number" label="Price per Item" v-model.number="pricePerItem"
            @input="lastEditedPricingField = 'pricePerItem'" outlined dense />
        </v-col>

        <v-col cols="6">
          <v-text-field type="number" label="Estimated Total Price" v-model.number="estimatedTotalPrice"
            @input="lastEditedPricingField = 'estimatedTotalPrice'" :error-messages="pricingError" outlined dense />
        </v-col>

        <!-- ================= Billing ================= -->
        <v-col cols="12">
          <div class="section-title mt-6">Billing</div>
        </v-col>

        <v-col cols="12" md="6">
          <v-select label="Send Billing *" :items="['Yes', 'No', 'Select']" v-model="sendBillingLocal"
            :rules="[requiredRule]" outlined dense />
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
    sendBilling: { type: String, default: "Select" },
    universities: { type: Array, default: () => [] }
  },

  data() {
    return {
      form: {
        ...this.lead,
        // Move_Out_Address: "",
        // Move_Out_City: "",
        // Move_Out_State: "",
        // Move_Out_Zip: "",
        Empty_Bin_Drop_Off_Date: "",
        Empty_Bin_Drop_Off_Address: "",
        Empty_Bin_Drop_Off_City: "",
        Empty_Bin_Drop_Off_State: "",
        Empty_Bin_Drop_Off_Zip: "",
        Empty_Bin_Drop_Off_Time_Window: ""
      },

      sendBillingLocal: this.sendBilling,

      pricePerItem: null,
      estimatedTotalPrice: 0,

      lastEditedPricingField: null,
      pricingError: null,

      skipEmptyBinDropOff: false
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
    sendBillingLocal(newVal) {
      this.$emit("update:sendBilling", newVal);
    },
    totalItems() {
      this.form.Custom_Pricing
        ? this.handleCustomPricing()
        : this.calculatePricing();
    },
    "form.Custom_Pricing"(val) {
      this.pricingError = null;
      this.lastEditedPricingField = null;

      if (val === false) {
        // 👈 Force auto pricing when custom pricing is turned OFF
        this.calculatePricing();
      } else {
        // 👈 When turning ON custom pricing, start from pricePerItem
        this.lastEditedPricingField = "pricePerItem";
        this.handleCustomPricing();
      }
    },


    pricePerItem() {
      if (this.form.Custom_Pricing && this.lastEditedPricingField === "pricePerItem") {
        this.handleCustomPricing();
      }
    },

    estimatedTotalPrice() {
      if (this.form.Custom_Pricing && this.lastEditedPricingField === "estimatedTotalPrice") {
        this.handleCustomPricing();
      }
    },

    skipEmptyBinDropOff(val) {
      if (val) this.clearEmptyBinDropOffFields();
    }
  },

  methods: {
    requiredRule(v) {
      return !!v || "Required";
    },

    roundCurrency(v) {
      return Number(parseFloat(v).toFixed(2));
    },

    pricingTable(total) {
      if (total <= 2) return 22.5;
      if (total <= 5) return 20;
      if (total <= 10) return 18;
      return 15;
    },

    handleCustomPricing() {
      if (this.totalItems <= 0) {
        this.pricingError = "Total Item Count must be greater than 0";
        return;
      }
      this.pricingError = null;

      if (this.lastEditedPricingField === "pricePerItem") {
        this.estimatedTotalPrice = this.roundCurrency(this.pricePerItem * this.totalItems);
      }

      if (this.lastEditedPricingField === "estimatedTotalPrice") {
        this.pricePerItem = this.roundCurrency(this.estimatedTotalPrice / this.totalItems);
      }
    },

    calculatePricing() {
      const price = this.pricingTable(this.totalItems);
      this.pricePerItem = price;
      this.estimatedTotalPrice = this.roundCurrency(price * this.totalItems);
    },

    clearEmptyBinDropOffFields() {
      this.form.Empty_Bin_Drop_Off_Date = "";
      this.form.Empty_Bin_Drop_Off_Address = "";
      this.form.Empty_Bin_Drop_Off_City = "";
      this.form.Empty_Bin_Drop_Off_State = "";
      this.form.Empty_Bin_Drop_Off_Zip = "";
    },

    createOrderHandleSubmit() {
      if (!this.$refs.form.validate()) return;

      const payload = {
        ...this.form,
        Total_Item_Count: this.totalItems,
        Price_per_Item: this.pricePerItem || 0,
        Estimated_Price: this.estimatedTotalPrice || 0,
        Custom_Pricing: this.form.Custom_Pricing,
        skipEmptyBinDropOff: this.skipEmptyBinDropOff
      };

      if (this.skipEmptyBinDropOff) {
        delete payload.Empty_Bin_Drop_Off_Date;
        delete payload.Empty_Bin_Drop_Off_Address;
        delete payload.Empty_Bin_Drop_Off_City;
        delete payload.Empty_Bin_Drop_Off_State;
        delete payload.Empty_Bin_Drop_Off_Zip;
        delete payload.Empty_Bin_Drop_Off_Time_Window;
      }

      this.$emit("submit", payload);
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
