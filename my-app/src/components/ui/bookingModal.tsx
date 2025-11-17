import * as React from "react"
import { Button } from "@/components/ui/button"

type Booking = {
    id: string;
    user_id?: string;
    room_id?: string;
    start_time?: string;
    duration?: string;
    paid_for?: boolean;
    [key: string]: any;
}

type Props = {
    booking: Booking | null
    open: boolean
    onClose: () => void
    onCancelBooking: (bookingId: string) => Promise<void>
}

export default function BookingModal({ booking, open, onClose, onCancelBooking }: Props) {
    const [loading, setLoading] = React.useState(false)
    const handleCancel = async () => {
        if (!booking) return
        setLoading(true)
        try{
            await onCancelBooking(booking.id)
            onClose()
        } finally {
            setLoading(false)
        }
    }
}
    if (!open || !booking) return null

    const start = booking.start_time ?new Date(booking.start_time) : null

    return(
        <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative z-10 w-full max-w-md rounded bg-white p-6 shadow-lg">
                <h3 className="mb-2 text-lg font-medium">Booking details</h3>        
                <div className="mb-4 text-sm space-y-2">
                    <div>
                        <strong>When:</strong>{" "}
                        {start ? start.toLocaleString("end-US", { dateStyle: "full", timeStyle: "short" }) : "N/A"}
                    </div>
                    <div><strong>Duration:</strong> {booking.duration ?? "—"}</div>
                    <div><strong>Room ID:</strong> {booking.room_id ?? "—"}</div>
                    <div><strong>Booked by:</strong> {booking.user_id ?? "—"}</div>
                    <div><strong>Paid:</strong> {booking.paid_for ? "Yes" : "No"}</div>
                </div>

                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose} disabled={loading}>Close</Button>
                    <Button onClick={handleCancel} disabled={loading} className="bg-red-600 hover:bg-red-700">
                        {loading ? "Cancelling..." : "Cancel Booking"}
                    </Button>
                </div>
            </div>   
        </div>
    )