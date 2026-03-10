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

        <!-- ================= Move Out Details ================= -->
        <v-col cols="12">
          <div class="section-title mt-6">Move Out Details</div>
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field type="date" label="Move Out Date" v-model="form.Move_Out_Date" outlined dense />
        </v-col>

        <v-col cols="12">
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

        <v-col cols="6" md="4">
          <v-combobox
            label="Move Out Time Window"
            v-model="form.Move_Out_Time_Window"
            :items="form.timeWindows"
            outlined
            dense
          />
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
            <div class="section-title mt-8 mb-2">Empty Bin Drop-Off</div>
          </v-col>

          <v-col cols="12" class="mb-2">
            <div class="bin-delivery-container pa-4">
              <v-row dense>
                <v-col cols="12">
                  <v-checkbox label="Skip Empty Bin Drop-Off Details" v-model="skipEmptyBinDropOff" />
                </v-col>

                <template v-if="!skipEmptyBinDropOff">
                  <!-- Top Tabs -->
                  <v-col cols="12">
                    <div class="delivery-mode-label mb-2">Delivery Type</div>

                    <v-btn-toggle
                      v-model="form.Student_Delivery_Type"
                      mandatory
                      class="delivery-toggle mb-4"
                    >
                      <v-btn value="on_campus" depressed>
                        <v-icon left>mdi-cube-outline</v-icon>
                        On Campus
                      </v-btn>
                      <v-btn value="off_campus" depressed>
                        <v-icon left>mdi-map-marker-outline</v-icon>
                        Off Campus
                      </v-btn>
                    </v-btn-toggle>
                  </v-col>

                  <!-- ================= ON CAMPUS ================= -->
                  <template v-if="form.Student_Delivery_Type === 'on_campus'">
                    <v-col cols="12">
                      <div class="delivery-mode-label mt-2 mb-3">On Campus Type</div>

                      <v-btn-toggle
                        v-model="onCampusDropTab"
                        mandatory
                        class="delivery-toggle mb-4"
                      >
                        <v-btn value="scheduled_drop" depressed>
                          Scheduled Drops
                        </v-btn>
                        <v-btn value="custom_drop" depressed>
                          Custom Drops
                        </v-btn>
                      </v-btn-toggle>
                    </v-col>

                    <!-- ON CAMPUS / SCHEDULED DROP -->
                    <template v-if="onCampusDropTab === 'scheduled_drop'">
                      <v-col cols="12" md="6" class="mt-2">
                        <v-select
                          label="University"
                          :items="universities"
                          item-text="label"
                          item-value="value"
                          v-model="form.Lead_University"
                          :rules="[requiredRule]"
                          outlined
                          dense
                        />
                      </v-col>

                      <v-col cols="12" md="6" class="mt-2">
                        <v-select
                          label="Bin Drop-Off Date"
                          :items="availableBinDeliveryDates"
                          item-text="label"
                          item-value="value"
                          v-model="selectedOnCampusDateId"
                          :loading="loadingBinDeliveryDates"
                          :disabled="!form.Lead_University || loadingBinDeliveryDates"
                          :rules="[requiredRule]"
                          outlined
                          dense
                          @change="applySelectedOnCampusDate"
                        />
                      </v-col>

                      <v-col
                        cols="12"
                        v-if="form.Lead_University && !loadingBinDeliveryDates && !availableBinDeliveryDates.length"
                      >
                        <div class="helper-text error--text">
                          No future on-campus scheduled bin delivery dates were found for the selected university.
                        </div>
                      </v-col>

                      <v-col cols="12" md="6" class="mt-1">
                        <v-text-field
                          label="Selected Service Date"
                          v-model="form.Empty_Bin_Drop_Off_Date"
                          readonly
                          outlined
                          dense
                        />
                      </v-col>

                      <v-col cols="12" md="6" class="mt-1">
                        <v-text-field
                          label="Selected Time Window"
                          v-model="form.Empty_Bin_Drop_Off_Time_Window"
                          readonly
                          outlined
                          dense
                        />
                      </v-col>
                    </template>

                    <!-- ON CAMPUS / CUSTOM DROP -->
                    <template v-else>
                      <v-col cols="12" md="6" class="mt-2">
                        <v-select
                          label="University"
                          :items="universities"
                          item-text="label"
                          item-value="value"
                          v-model="form.Lead_University"
                          :rules="[requiredRule]"
                          outlined
                          dense
                        />
                      </v-col>

                      <v-col cols="12" md="6" class="mt-2">
                        <v-text-field
                          type="date"
                          label="Bin Drop-Off Date"
                          v-model="form.Empty_Bin_Drop_Off_Date"
                          :rules="[requiredRule]"
                          outlined
                          dense
                        />
                      </v-col>

                      <v-col cols="12" md="6" class="mt-1">
                        <v-combobox
                          label="Empty Bin Drop-Off Time Window"
                          v-model="form.Empty_Bin_Drop_Off_Time_Window"
                          :items="form.timeWindows"
                          :rules="[requiredRule]"
                          outlined
                          dense
                        />
                      </v-col>
                    </template>
                  </template>

                  <!-- ================= OFF CAMPUS ================= -->
                  <template v-else>
                    <v-col cols="12" md="6" class="mt-2">
                      <v-text-field
                        type="date"
                        label="Bin Drop-Off Date"
                        v-model="form.Empty_Bin_Drop_Off_Date"
                        :rules="[requiredRule]"
                        outlined
                        dense
                      />
                    </v-col>

                    <v-col cols="12" md="6" class="mt-2">
                      <v-combobox
                        label="Empty Bin Drop-Off Time Window"
                        v-model="form.Empty_Bin_Drop_Off_Time_Window"
                        :items="form.timeWindows"
                        :rules="[requiredRule]"
                        outlined
                        dense
                      />
                    </v-col>

                    <v-col cols="12" class="mt-2">
                      <v-text-field
                        label="Bin Drop-Off Address"
                        v-model="form.Empty_Bin_Drop_Off_Address"
                        :rules="[requiredRule]"
                        outlined
                        dense
                      />
                    </v-col>

                    <v-col cols="6">
                      <v-text-field
                        label="City"
                        v-model="form.Empty_Bin_Drop_Off_City"
                        :rules="[requiredRule]"
                        outlined
                        dense
                      />
                    </v-col>

                    <v-col cols="6">
                      <v-text-field
                        label="State"
                        v-model="form.Empty_Bin_Drop_Off_State"
                        :rules="[requiredRule]"
                        outlined
                        dense
                      />
                    </v-col>

                    <v-col cols="6">
                      <v-text-field
                        label="ZIP"
                        v-model="form.Empty_Bin_Drop_Off_Zip"
                        :rules="[requiredRule]"
                        outlined
                        dense
                      />
                    </v-col>
                  </template>
                </template>
              </v-row>
            </div>
          </v-col>
        </template>

        <!-- ================= Pricing ================= -->
        <v-col cols="12">
          <div class="section-title mt-6">Pricing</div>
        </v-col>

        <v-col cols="12" md="4">
          <v-checkbox label="Custom Pricing" v-model="form.Custom_Pricing" />
        </v-col>

        <v-col cols="6" v-if="form.Custom_Pricing">
          <v-text-field
            type="number"
            label="Price per Item"
            v-model.number="pricePerItem"
            @input="lastEditedPricingField = 'pricePerItem'"
            outlined
            dense
          />
        </v-col>

        <v-col cols="6">
          <v-text-field
            type="number"
            label="Estimated Total Price"
            v-model.number="estimatedTotalPrice"
            @input="lastEditedPricingField = 'estimatedTotalPrice'"
            :error-messages="pricingError"
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
            label="Send Billing *"
            :items="['Yes', 'No', 'Select']"
            v-model="sendBillingLocal"
            :rules="[requiredRule]"
            outlined
            dense
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
    sendBilling: { type: String, default: "Select" },
    universities: { type: Array, default: () => [] }
  },

  data() {
    return {
      form: {
        timeWindows: [],
        Empty_Bin_Drop_Off_Date: "",
        Empty_Bin_Drop_Off_Address: "",
        Empty_Bin_Drop_Off_City: "",
        Empty_Bin_Drop_Off_State: "",
        Empty_Bin_Drop_Off_Zip: "",
        Empty_Bin_Drop_Off_Time_Window: "",
        Student_Delivery_Type: "on_campus",
        Selected_Bin_Delivery_Date: "",
        ...this.lead,
      },

      sendBillingLocal: this.sendBilling,

      pricePerItem: null,
      estimatedTotalPrice: 0,

      lastEditedPricingField: null,
      pricingError: null,

      skipEmptyBinDropOff: false,

      availableBinDeliveryDates: [],
      selectedOnCampusDateId: "",
      loadingBinDeliveryDates: false,
      onCampusDropTab: "scheduled_drop"
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
        this.calculatePricing();
      } else {
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

      if (
        !val &&
        this.form.Student_Delivery_Type === "on_campus" &&
        this.onCampusDropTab === "scheduled_drop" &&
        this.form.Lead_University
      ) {
        this.fetchBinDeliveryDates();
      }
    },

    "form.Lead_University"() {
      if (this.skipEmptyBinDropOff) return;

      if (
        this.form.Student_Delivery_Type === "on_campus" &&
        this.onCampusDropTab === "scheduled_drop"
      ) {
        this.selectedOnCampusDateId = "";
        this.form.Empty_Bin_Drop_Off_Date = "";
        this.form.Empty_Bin_Drop_Off_Time_Window = "";
        this.form.Selected_Bin_Delivery_Date = "";
        this.clearOffCampusAddressFields();

        if (this.form.Lead_University) {
          this.fetchBinDeliveryDates();
        } else {
          this.availableBinDeliveryDates = [];
        }
      }
    },

    "form.Student_Delivery_Type"(newVal) {
      if (this.skipEmptyBinDropOff) return;

      this.form.Empty_Bin_Drop_Off_Date = "";
      this.form.Empty_Bin_Drop_Off_Time_Window = "";
      this.form.Selected_Bin_Delivery_Date = "";
      this.selectedOnCampusDateId = "";
      this.availableBinDeliveryDates = [];

      if (newVal === "on_campus") {
        this.clearOffCampusAddressFields();

        if (!this.onCampusDropTab) {
          this.onCampusDropTab = "scheduled_drop";
        }

        if (
          this.onCampusDropTab === "scheduled_drop" &&
          this.form.Lead_University
        ) {
          this.fetchBinDeliveryDates();
        }
      }
    },

    onCampusDropTab(newVal) {
      if (this.skipEmptyBinDropOff) return;
      if (this.form.Student_Delivery_Type !== "on_campus") return;

      this.form.Empty_Bin_Drop_Off_Date = "";
      this.form.Empty_Bin_Drop_Off_Time_Window = "";
      this.form.Selected_Bin_Delivery_Date = "";
      this.selectedOnCampusDateId = "";
      this.availableBinDeliveryDates = [];
      this.clearOffCampusAddressFields();

      if (newVal === "scheduled_drop" && this.form.Lead_University) {
        this.fetchBinDeliveryDates();
      }
    }
  },

  methods: {
    /* eslint-disable */
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

    async fetchTimeWindowPicklists() {
      try {
        const defaultTimeWindows = [
          "8AM - 10AM",
          "10AM - 12PM",
          "12PM - 2PM",
          "2PM - 4PM",
          "4PM - 6PM"
        ];

        const moveOutField = await ZOHO.CRM.META.getField({
          Entity: "Leads",
          Field: "Move_Out_Time_Window"
        });

        const emptyBinField = await ZOHO.CRM.META.getField({
          Entity: "Leads",
          Field: "Empty_Bin_Drop_Off_Time_Window"
        });

        const zohoPicklistValues = [
          ...(moveOutField.picklist_values || []).map(p => p.display_value),
          ...(emptyBinField.picklist_values || []).map(p => p.display_value)
        ];

        const merged = [...zohoPicklistValues, ...defaultTimeWindows];

        this.form.timeWindows = [...new Set(merged)];
      } catch (err) {
        console.error("Error fetching Time Window picklists:", err);

        this.form.timeWindows = [
          "8AM - 10AM",
          "10AM - 12PM",
          "12PM - 2PM",
          "2PM - 4PM",
          "4PM - 6PM"
        ];
      }
    },

    getTodayISODate() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },

    formatDateForInput(value) {
      if (!value) return "";

      if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return value;
      }

      const date = new Date(value);
      if (isNaN(date.getTime())) return "";

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },

    async fetchBinDeliveryDates() {
      if (!this.form.Lead_University) {
        this.availableBinDeliveryDates = [];
        return;
      }

      this.loadingBinDeliveryDates = true;

      try {
        let allDates = [];
        let page = 1;
        let keepFetching = true;

        while (keepFetching) {
          const resp = await ZOHO.CRM.API.getAllRecords({
            Entity: "Dates",
            page,
            per_page: 200
          });

          const records = resp && resp.data ? resp.data : [];
          allDates = allDates.concat(records);

          if (!records.length || records.length < 200) {
            keepFetching = false;
          } else {
            page += 1;
          }
        }

        const today = this.getTodayISODate();
        const selectedUniversityId = String(this.form.Lead_University);

        const filtered = allDates.filter(record => {
          const universityId =
            record &&
            record.University &&
            record.University.id
              ? String(record.University.id)
              : "";

          const typeValue = (record && record.Type ? String(record.Type) : "").trim().toLowerCase();
          const eventDate = this.formatDateForInput(record && record.Event_Date ? record.Event_Date : "");

          const isMatchingUniversity = universityId === selectedUniversityId;
          const isBinDeliveryType = typeValue === "bin delivery dates";
          const isCurrentOrFuture = !!eventDate && eventDate >= today;

          return isMatchingUniversity && isBinDeliveryType && isCurrentOrFuture;
        });

        filtered.sort((a, b) => {
          const dateA = this.formatDateForInput(a.Event_Date);
          const dateB = this.formatDateForInput(b.Event_Date);

          if (dateA < dateB) return -1;
          if (dateA > dateB) return 1;
          return 0;
        });

        this.availableBinDeliveryDates = filtered.map(record => ({
          label: record.Name || `${record.Event_Date || ""} ${record.Time_Window || ""}`.trim(),
          value: record.id,
          raw: record
        }));
      } catch (err) {
        console.error("Error fetching bin delivery dates:", err);
        this.availableBinDeliveryDates = [];
      } finally {
        this.loadingBinDeliveryDates = false;
      }
    },

    applySelectedOnCampusDate() {
      const selected = this.availableBinDeliveryDates.find(
        item => item.value === this.selectedOnCampusDateId
      );

      if (!selected || !selected.raw) {
        this.form.Empty_Bin_Drop_Off_Date = "";
        this.form.Empty_Bin_Drop_Off_Time_Window = "";
        this.form.Selected_Bin_Delivery_Date = "";
        return;
      }

      this.form.Empty_Bin_Drop_Off_Date = this.formatDateForInput(selected.raw.Event_Date);
      this.form.Empty_Bin_Drop_Off_Time_Window = selected.raw.Time_Window || "";
      this.form.Selected_Bin_Delivery_Date = selected.raw.id || "";
      this.clearOffCampusAddressFields();
    },

    clearOffCampusAddressFields() {
      this.form.Empty_Bin_Drop_Off_Address = "";
      this.form.Empty_Bin_Drop_Off_City = "";
      this.form.Empty_Bin_Drop_Off_State = "";
      this.form.Empty_Bin_Drop_Off_Zip = "";
    },

    clearEmptyBinDropOffFields() {
      this.form.Empty_Bin_Drop_Off_Date = "";
      this.form.Empty_Bin_Drop_Off_Address = "";
      this.form.Empty_Bin_Drop_Off_City = "";
      this.form.Empty_Bin_Drop_Off_State = "";
      this.form.Empty_Bin_Drop_Off_Zip = "";
      this.form.Empty_Bin_Drop_Off_Time_Window = "";
      this.form.Selected_Bin_Delivery_Date = "";
      this.selectedOnCampusDateId = "";
      this.availableBinDeliveryDates = [];
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

      console.log("Create Order payload:", payload);

      if (this.skipEmptyBinDropOff) {
        delete payload.Empty_Bin_Drop_Off_Date;
        delete payload.Empty_Bin_Drop_Off_Address;
        delete payload.Empty_Bin_Drop_Off_City;
        delete payload.Empty_Bin_Drop_Off_State;
        delete payload.Empty_Bin_Drop_Off_Zip;
        delete payload.Empty_Bin_Drop_Off_Time_Window;
        delete payload.Selected_Bin_Delivery_Date;
      }

      this.$emit("submit", payload);
    }
  },

  mounted() {
    this.fetchTimeWindowPicklists();

    if (
      Number(this.form.No_of_Bins || 0) > 0 &&
      !this.skipEmptyBinDropOff &&
      this.form.Student_Delivery_Type === "on_campus" &&
      this.onCampusDropTab === "scheduled_drop" &&
      this.form.Lead_University
    ) {
      this.fetchBinDeliveryDates();
    }
  },
};
</script>

<style scoped>
.section-title {
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #555;
}

.delivery-mode-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #444;
}

.delivery-toggle {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 8px;
}

.delivery-toggle .v-btn {
  text-transform: none;
  min-width: 150px;
}

.helper-text {
  font-size: 0.875rem;
}

.bin-delivery-container {
  border-radius: 8px;
}
</style>