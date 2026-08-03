# Refreshr: Dev Health & Wellness Reminder

**Refreshr** is a smart, interactive wellness companion for developers built directly into VS Code. It encourages healthy habits throughout long coding sessions by sending timely notifications to drink water, rest your eyes, and stand up/stretch.

## Features

- **Customizable Reminders**:
  - 💧 **Water Reminder**: Keeps you hydrated with regular beverage alerts.
  - 👀 **Eye Break (20-20-20 Rule)**: Encourages you to look at something 20 feet away for 20 seconds.
  - 🚶 **Stand & Stretch**: Prompts you to stand up, stretch, and move.
- **Dynamic Status Bar**: Displays a countdown timer showing the closest upcoming reminder. Click it to open the controls menu.
- **Actionable Notifications**: Choose to log a reminder as **Done**, **Snooze** it for 5 minutes, or **Skip** it.
- **Detailed Wellness Statistics**: Track daily and lifetime logs of your healthy habits.

## Extension Settings

You can customize the intervals and messages in your VS Code settings:

* `refreshr.water`: Configuration object for drinking water reminders.
  * `enabled`: Enable/disable reminders.
  * `interval`: Reminder interval in minutes (default: `60`).
  * `message`: Custom alert message.
* `refreshr.eye`: Configuration object for eye breaks.
  * `enabled`: Enable/disable reminders.
  * `interval`: Reminder interval in minutes (default: `20`).
  * `message`: Custom alert message.
* `refreshr.stand`: Configuration object for stand & stretch reminders.
  * `enabled`: Enable/disable reminders.
  * `interval`: Reminder interval in minutes (default: `45`).
  * `message`: Custom alert message.

### How to Customize Settings

You can customize these configurations in two ways:

1. **Through the Settings UI**:
   - Click the **Gear (⚙️) Icon** in the bottom-left corner and select **Settings**.
   - Or open the Command Palette (`Ctrl + Shift + P` / `Cmd + Shift + P`), search for `Preferences: Open User Settings`, and press Enter.
   - Search for **Refreshr** in the search bar. You can toggle checkboxes, change intervals, and write custom messages there.

2. **Through `settings.json`**:
   - Add configurations directly to your workspace or user `settings.json`:
     ```json
     {
       "refreshr.water": {
         "enabled": true,
         "interval": 30,
         "message": "Drink water now! 💧"
       }
     }
     ```

## Commands

Search for these commands in the VS Code Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`):

- **Refreshr: Start Reminders**: Starts or resumes the wellness timers.
- **Refreshr: Pause Reminders**: Pauses all active timers.
- **Refreshr: View Wellness Stats**: Shows today's and lifetime stats for completed/snoozed/skipped activities.
- **Refreshr: Reset Stats & Timers**: Resets all tracking metrics and restarts intervals.
