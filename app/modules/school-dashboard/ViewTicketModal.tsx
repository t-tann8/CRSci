'use client';

import React from 'react';
import { X } from 'lucide-react';
import SyncIcon from '@/app/assets/icons/SyncIcon';
import { Label } from '@/app/components/ui/label';

function ViewTicketModal({ onClose, ticketDetails }: any) {
    return (
        <section className="w-full bg-white h-screen py-4 px-6 shadow-lg">
            <div>
                <div className="flex justify-between items-center">
                    <div className="flex my-7">
                        <div className="bg-green-100 px-3 h-fit py-3 rounded-lg">
                            <SyncIcon fill="#7AA43E" width="30" height="30" />
                        </div>
                        <div className="flex flex-col ml-2">
                            <h3 className="text-xl font-semibold mr-1">
                                View Ticket
                            </h3>
                            <p className="text-sm text-dark-gray mb-2">
                                Ticket Details
                            </p>
                        </div>
                    </div>
                    <div className="rounded-full bg-white border p-1 cursor-pointer">
                        <X size={15} onClick={onClose} />
                    </div>
                </div>
            </div>
            <div>
                <div className="flex flex-col space-y-2">
                    <Label className="font-semibold">Complaint Type</Label>
                    <p className="p-2 bg-gray-100 rounded-lg">
                        {ticketDetails.complaint_type}
                    </p>
                </div>
                <div className="flex flex-col space-y-2 mt-7">
                    <Label className="font-semibold">Your Message</Label>
                    <p className="p-2 bg-gray-100 rounded-lg">
                        {ticketDetails.message}
                    </p>
                </div>
            </div>
        </section>
    );
}

export default ViewTicketModal;
