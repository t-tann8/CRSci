'use client';

import React, { useState } from 'react';
import Searchbar from '@/app/components/common/Searchbar';
import VisaIcon from '@/app/assets/icons/VisaIcon';
import StripeIcon from '@/app/assets/icons/StripeIcon';
import PayPalIcon from '@/app/assets/icons/PayPalIcon';
import AppInput from '@/app/components/common/AppInput';
import { Label } from '@/app/components/ui/label';

function Payment() {
    const [isFocused, setIsFocused] = useState(false);
    return (
        <section className="lg:px-5">
            <Searchbar
                headerText="Payment Info"
                tagline="Here’s Your Payment Information"
            />
            <div className="flex flex-col justify-center items-center mt-10  ">
                <div className="h-fit px-5 py-5 md:px-7 md:py-7 lg:px-8 lg:py-8  rounded-lg shadow-[0px_4px_20px_0px_rgb(0,0,0,0.05)] ">
                    <h1 className="font-semibold text-xl">Card Information</h1>
                    <p className="text-sm text-dark-gray font-medium">
                        Don’t Worry your Information Is Completely Secure
                    </p>

                    <div className="flex flex-col mt-5  ">
                        <Label htmlFor="card_name" className="font-medium mb-2">
                            Card Number
                        </Label>

                        <div
                            className={`border ${
                                isFocused
                                    ? 'outline-none border-sky-500 ring-1 ring-sky-500'
                                    : 'border-gray-300'
                            } flex items-center justify-between px-3 py-3 rounded-lg w-full bg-slate-100 text-sm shadow-sm`}
                        >
                            <input
                                type="text"
                                id="card_number"
                                name="card_number"
                                className="bg-slate-100 rounded-lg outline-none w-full placeholder-slate-400"
                                placeholder="Enter Card Number"
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                            />
                            <div>
                                <VisaIcon />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col mt-5 ">
                        <Label htmlFor="card_name" className="font-medium mb-2">
                            Cardholder Name
                        </Label>

                        <AppInput
                            id="card_name"
                            name="card_name"
                            placeholder="Enter Cardholder Name"
                        />
                    </div>

                    <div className="flex mt-5 justify-between w-[100%]">
                        <div className="flex flex-col">
                            <Label
                                htmlFor="expiry"
                                className="font-medium mb-2"
                            >
                                Expiry
                            </Label>

                            <div className="w-[100%]">
                                <AppInput
                                    type="text"
                                    id="expiry"
                                    name="expiry"
                                    placeholder="MM/YY"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col ml-3">
                            <Label htmlFor="cvv" className="font-medium mb-2">
                                CVV
                            </Label>

                            <div className="w-[100%]">
                                <AppInput
                                    type="text"
                                    id="cvv"
                                    name="cvv"
                                    placeholder="eg: 1234"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="bg-primary-color text-center font-semibold cursor-pointer lg:hover:bg-orange-400 rounded-lg py-2 text-white mt-5 ">
                        <span>Pay Now</span>
                    </div>

                    <div className="text-center font-semibold mt-5">Or</div>
                    <div>
                        <div className="border flex space-x-2 justify-center items-center text-center font-semibold cursor-pointer rounded-lg py-2 lg:hover:bg-gray-100 mt-5">
                            <StripeIcon />
                            <span>Pay With Stripe</span>
                        </div>
                        <div className="border flex space-x-2 justify-center items-center text-center font-semibold cursor-pointer rounded-lg py-2  lg:hover:bg-gray-100 mt-5">
                            <PayPalIcon />
                            <span>Pay With Paypal</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Payment;
