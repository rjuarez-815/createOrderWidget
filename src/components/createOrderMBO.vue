<template>
    <v-card class="pa-6 mx-auto" elevation="4" max-width="1100">
        <v-card-subtitle>
            Review and confirm Moving Box Rental details before creating the Order
        </v-card-subtitle>

        <v-divider class="mb-6" />

        <v-form ref="form" v-model="isValid" @submit.prevent="handleSubmit">
            <v-row dense>

                <!-- ================= Lead Information ================= -->
                <v-col cols="12">
                    <div class="section-title">Lead Information</div>
                </v-col>

                <v-col cols="12" md="6">
                    <v-text-field label="First Name" v-model="form.First_Name" outlined dense />
                </v-col>

                <v-col cols="12" md="6">
                    <v-text-field
                        label="Last Name *"
                        v-model="form.Last_Name"
                        outlined
                        dense
                        :rules="[v => !!v || 'Last name is required']"
                        required
                    />
                </v-col>

                <v-col cols="12" md="6">
                    <v-text-field label="Phone" v-model="form.Phone" outlined dense />
                </v-col>

                <v-col cols="12" md="6">
                    <v-text-field label="Email" v-model="form.Email" outlined dense />
                </v-col>

                <!-- ================= Address ================= -->
                <v-col cols="12">
                    <div class="section-title mt-6">Address</div>
                </v-col>

                <!-- -------- Delivery -------- -->
                <v-col cols="12">
                    <div class="sub-section-title mt-2 mb-3">Delivery</div>
                </v-col>

                <v-col cols="6">
                    <v-text-field label="Delivery Address" v-model="form.Delivery_Address" outlined dense />
                </v-col>
                <v-col cols="6">
                    <v-text-field label="Delivery City" v-model="form.Delivery_City" outlined dense />
                </v-col>
                <v-col cols="6">
                    <v-text-field label="Delivery State" v-model="form.Delivery_State" outlined dense />
                </v-col>
                <v-col cols="6">
                    <v-text-field label="Delivery Zip" v-model="form.Delivery_Zip" outlined dense />
                </v-col>

                <!-- -------- Pickup -------- -->
                <v-col cols="12">
                    <div class="sub-section-title mt-2 mb-3">Pickup</div>
                </v-col>

                <v-col cols="6">
                    <v-text-field label="Pickup Address" v-model="form.Pickup_Address" outlined dense />
                </v-col>
                <v-col cols="6">
                    <v-text-field label="Pickup City" v-model="form.Pickup_City" outlined dense />
                </v-col>
                <v-col cols="6">
                    <v-text-field label="Pickup State" v-model="form.Pickup_State" outlined dense />
                </v-col>
                <v-col cols="6">
                    <v-text-field label="Pickup Zip" v-model="form.Pickup_Zip" outlined dense />
                </v-col>

                <!-- ================= Rental Details ================= -->
                <v-col cols="12">
                    <div class="section-title mt-6">Rental Details</div>
                </v-col>

                <v-col cols="6">
                    <v-text-field type="date" label="Rental Start Date" v-model="form.Rental_Start_Date" outlined dense />
                </v-col>

                <v-col cols="6">
                    <v-text-field type="date" label="Rental End Date" v-model="form.Rental_End_Date" outlined dense />
                </v-col>

                <v-col cols="4">
                    <v-text-field type="number" label="Bedrooms Count" v-model.number="form.Bedrooms_Count" outlined dense min="1" />
                </v-col>

                <!-- ================= Options ================= -->
                <v-col cols="12">
                    <div class="section-title mt-6">Options</div>
                </v-col>

                <v-col cols="4">
                    <v-checkbox label="Free Dolly Rental" v-model="form.Free_Rental" />
                </v-col>

                <v-col cols="4">
                    <v-checkbox label="Include Bubble Wrap (+$60)" v-model="form.Include_Bubble_Wrap" />
                </v-col>

                <v-col cols="4">
                    <v-checkbox label="Custom Pricing" v-model="form.Custom_Pricing" />
                </v-col>

                <!-- ================= Pricing ================= -->
                <v-col cols="12">
                    <div class="section-title mt-6">Pricing</div>
                </v-col>

                <!-- ===== AUTO PRICING ===== -->
                <template v-if="!form.Custom_Pricing">
                    <v-col cols="3">
                        <v-text-field label="Total Boxes" :value="totalBoxCount" outlined dense readonly />
                    </v-col>
                    <v-col cols="3">
                        <v-text-field label="Weeks" :value="weeks" outlined dense readonly />
                    </v-col>
                    <v-col cols="3">
                        <v-text-field label="Box Tier" :value="boxTier" outlined dense readonly />
                    </v-col>
                    <v-col cols="3">
                        <v-text-field label="Discount" :value="discountLabel" outlined dense readonly />
                    </v-col>
                    <v-col cols="6">
                        <v-text-field label="Final Order Total" :value="`$${orderTotal}`" outlined dense readonly />
                    </v-col>
                </template>

                <!-- ===== CUSTOM PRICING ===== -->
                <template v-else>
                    <v-col cols="3">
                        <v-text-field
                            label="Order Custom Subtotal"
                            type="number"
                            v-model.number="form.Order_Subtotal"
                            outlined
                            dense
                        />
                    </v-col>

                    <v-col cols="3">
                        <v-text-field
                            label="Bubble Wrap"
                            :value="form.Include_Bubble_Wrap ? 60 : 0"
                            outlined
                            dense
                            readonly
                        />
                    </v-col>

                    <v-col cols="6">
                        <v-text-field
                            label="Final Order Total"
                            :value="`$${customOrderTotal}`"
                            outlined
                            dense
                            readonly
                        />
                    </v-col>
                </template>

                <!-- ================= Billing ================= -->
                <v-col cols="12">
                    <div class="section-title mt-6">Billing</div>
                </v-col>

                <v-col cols="6">
                    <v-select
                        label="Send Billing *"
                        :items="['Yes', 'No', 'Select']"
                        v-model="sendBillingLocal"
                        outlined
                        dense
                        :rules="[v => !!v || 'Send Billing is required']"
                        required
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
    name: "CreateOrderMBO",

    props: {
        lead: { type: Object, required: true },
        sendBilling: { type: String, default: "Select" }
    },

    data() {
        return {
            isValid: false,
            sendBillingLocal: this.sendBilling,
            form: {
                ...this.lead,
                Bedrooms_Count: this.lead.Bedrooms_Count || 1,
                Free_Rental: Boolean(this.lead.Free_Rental),
                Include_Bubble_Wrap: Boolean(this.lead.Include_Bubble_Wrap),

                Order_Subtotal: 0,

                Base_Price: 0,
                Additional_Week_Rate: 0,
                Discount_Percentage: 0,
                Bubble_Wrap_Price: 0,
                Order_Total: 0
            }
        };
    },

    computed: {
        totalBoxCount() {
            return this.form.Bedrooms_Count * 20;
        },
        boxTier() {
            const b = this.totalBoxCount;
            if (b <= 20) return 1;
            if (b <= 40) return 2;
            if (b <= 60) return 3;
            if (b <= 80) return 4;
            return 5;
        },
        weeks() {
            if (!this.form.Rental_Start_Date || !this.form.Rental_End_Date) return 1;
            const start = new Date(this.form.Rental_Start_Date);
            const end = new Date(this.form.Rental_End_Date);
            const days = Math.ceil((end - start) / 86400000);
            return Math.max(1, Math.ceil(days / 7));
        },
        basePrice() {
            return { 1: 119, 2: 139, 3: 169, 4: 199, 5: 249 }[this.boxTier];
        },
        additionalWeekRate() {
            return { 1: 50, 2: 65, 3: 80, 4: 95, 5: 110 }[this.boxTier];
        },
        rentalCost() {
            return this.basePrice + (this.weeks - 1) * this.additionalWeekRate;
        },
        discountMultiplier() {
            if (this.weeks >= 8) return 0.8;
            if (this.weeks >= 4) return 0.9;
            return 1;
        },
        discountLabel() {
            return `${Math.round((1 - this.discountMultiplier) * 100)}%`;
        },
        orderTotal() {
            const bubble = this.form.Include_Bubble_Wrap ? 60 : 0;
            return Math.round(this.rentalCost * this.discountMultiplier + bubble);
        },
        customOrderTotal() {
            const bubble = this.form.Include_Bubble_Wrap ? 60 : 0;
            return Number(this.form.Order_Subtotal || 0) + bubble;
        }
    },

    watch: {
        sendBillingLocal(val) {
            this.$emit("update:sendBilling", val);
        }
    },

    methods: {
        handleSubmit() {
            if (!this.$refs.form.validate()) return;

            const isCustom = this.form.Custom_Pricing === true;

            this.$emit("submit", {
                ...this.form,
                Total_Box_Count: this.totalBoxCount,
                Box_Tier: isCustom ? null : this.boxTier,
                Weeks_Count: isCustom ? null : this.weeks,
                Order_Total: isCustom ? this.customOrderTotal : this.orderTotal,
                Send_Billing: this.sendBillingLocal,
                Lead_Type: "Moving Box Rental",
                Custom_Pricing: this.form.Custom_Pricing
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
.sub-section-title {
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    color: #777;
    padding-left: 4px;
    border-left: 3px solid #e0e0e0;
}
</style>
