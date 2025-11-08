# SMS NOTIFICATION SYSTEM - TROPICAL PARKING

## Setup Requirements

**Recommended Service:** Twilio (twilio.com)
- **Cost:** ~$20-50/month for typical volume
- **Phone Number:** ~$1/month
- **SMS Rate:** $0.0079 per message (outbound)

## Setup Steps

1. Create account at twilio.com
2. Purchase a phone number
3. Get API credentials (Account SID & Auth Token)
4. Integrate with your booking system
5. Test with your own phone number

---

## MESSAGE 1: Booking Confirmation (Immediate)

**Trigger:** Right after booking is completed

```
Hi {customer_name}! Your {location} parking is confirmed for {date}.

📍 Address: {parking_address}
🚐 FREE Shuttle: Every 60 mins
📞 Call/Text: 954-278-1990 when you arrive

We'll text you shuttle updates on arrival day!
- Tropical Parking
```

---

## MESSAGE 2: Day Before Arrival

**Trigger:** 24 hours before parking start date at 6pm

```
Hi {customer_name}! Tomorrow you'll park at {location}.

🚐 SHUTTLE INFO:
• Runs every 60 minutes
• We'll notify you 10 mins before pickup
• Call 954-278-1990 when you arrive

📍 Parking: {address}
🎫 Booking: {booking_id}

Have a great trip!
- Tropical Parking
```

---

## MESSAGE 3: Customer Arrives (Manual/Automated)

**Trigger:** When customer calls/texts or arrives at lot

```
Thanks {customer_name}! 

🚐 Shuttle dispatched to {location}
⏱️ Estimated arrival: {estimated_time}

We'll text you when it's 5 mins away.

Track shuttle: {tracking_link}
```

**Note:** If you have GPS tracking on shuttle, provide real-time link. Otherwise, just provide estimated time.

---

## MESSAGE 4: Shuttle Approaching (5 mins before)

**Trigger:** Manual or GPS-based when shuttle is 5 mins away

```
🚐 SHUTTLE ALERT!

Your shuttle arrives at {location} in 5 MINUTES.

Driver: {driver_name}
Vehicle: {vehicle_description}

Please be ready at pickup area!
```

---

## MESSAGE 5: Return Trip Reminder

**Trigger:** When customer's return date arrives (sent at 8am)

```
Welcome back {customer_name}!

To request shuttle pickup from airport:
📞 Call/Text: 954-278-1990
📍 Tell us your terminal & location

Shuttle runs every 60 mins.
We'll confirm your pickup time!

Rate your experience: {feedback_link}
```

---

## MESSAGE 6: Post-Trip Feedback (24 hours after return)

**Trigger:** 24 hours after return date

```
Hi {customer_name}, thanks for choosing Tropical Parking!

How was your experience? (Takes 30 seconds)
{survey_link}

Leave a review, get 10% off next booking! ⭐

Book again: tropicalparking.com
- Tropical Parking
```

---

## Implementation Notes

### Variables to Replace

- `{customer_name}` - Customer's first name
- `{location}` - Fort Lauderdale or Toronto
- `{date}` - Parking start date (formatted: Nov 15)
- `{parking_address}` - Full address of parking location
- `{booking_id}` - Unique booking reference number
- `{address}` - Short address for reminders
- `{estimated_time}` - Shuttle ETA (e.g., "15 minutes")
- `{tracking_link}` - Optional GPS tracking URL
- `{driver_name}` - Shuttle driver's name
- `{vehicle_description}` - E.g., "White van, plate #ABC123"
- `{feedback_link}` - Link to Google Form (bit.ly/tropicalfeedback)
- `{survey_link}` - Same as feedback_link

### SMS Best Practices

1. **Keep it under 160 characters when possible** - SMS is charged per 160-char segment
2. **Use emojis sparingly** - They help readability but take up characters
3. **Always include opt-out option** - Add "Reply STOP to unsubscribe" to first message
4. **Time messages appropriately** - No messages before 8am or after 9pm
5. **Track delivery status** - Monitor which messages are delivered/failed

### Twilio Integration Example (Node.js)

```javascript
const twilio = require('twilio');
const client = twilio(accountSid, authToken);

function sendBookingConfirmation(customerPhone, customerName, location, date, address) {
  const message = `Hi ${customerName}! Your ${location} parking is confirmed for ${date}.\n\n📍 Address: ${address}\n🚐 FREE Shuttle: Every 60 mins\n📞 Call/Text: 954-278-1990 when you arrive\n\nWe'll text you shuttle updates on arrival day!\n- Tropical Parking`;
  
  client.messages.create({
    body: message,
    from: '+19542781990', // Your Twilio number
    to: customerPhone
  })
  .then(message => console.log('SMS sent:', message.sid))
  .catch(error => console.error('SMS failed:', error));
}
```

---

## Cost Estimates

### Monthly Volume: 200 bookings

- Message 1 (Confirmation): 200 × $0.0079 = $1.58
- Message 2 (Day Before): 200 × $0.0079 = $1.58
- Message 3 (Arrival): 200 × $0.0079 = $1.58
- Message 4 (Shuttle Alert): 200 × $0.0079 = $1.58
- Message 5 (Return): 200 × $0.0079 = $1.58
- Message 6 (Feedback): 200 × $0.0079 = $1.58

**Total SMS costs: ~$9.50/month**
**Phone number: $1/month**
**Total: ~$10.50/month**

**ROI:** If SMS system prevents even 2 customers from leaving negative reviews or improves rebooking by 5%, it pays for itself many times over.

---

## Alternative: Manual SMS (Start Simple)

If you're not ready for full automation:

1. Use your existing business phone (954-278-1990)
2. Save these templates in your phone's notes
3. Manually send messages using copy/paste
4. Update customer name and details before sending
5. Upgrade to automated system once volume increases

**This approach costs $0 but requires 5-10 mins per booking.**