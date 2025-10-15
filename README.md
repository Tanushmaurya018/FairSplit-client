# Expense Splitter Frontend Documentation

## Overview

The frontend of the Expense Splitter Service is built using Next.js, Tailwind CSS, and TypeScript. It provides the user interface for managing groups, adding expenses, viewing balances, and checking settlement suggestions.

## Architecture

The frontend communicates with the backend through Axios-based REST API calls. It follows a component-driven structure with reusable UI components and clean state management using React hooks.

## Core Features

### Authentication
Allows users to sign up, log in, and maintain sessions securely. Authentication tokens are managed and persisted for seamless user experience.

### Dashboard
Displays all groups the user is part of and enables new group creation. Provides a quick overview of recent activities and pending settlements.

### Group Details
Shows all expenses within a group, participant contributions, and real-time balance updates. Users can view complete expense history and individual member balances.

### Add Expense Form
Lets users specify:
- Payer (who paid for the expense)
- Participants (who should split the cost)
- Amount and description
- Optional category or notes

### Settlement View
Displays who owes whom and how much based on backend calculations. Shows the optimal set of transactions needed to settle all debts within a group.

The design follows a consistent color scheme and typography system for a cohesive user experience.

## Integration

The frontend interacts with backend APIs to:
- Fetch user and group data
- Create expenses
- Retrieve balance information
- Calculate settlement suggestions

Pages are updated dynamically after successful API responses, providing immediate feedback to users.

## Testing and Validation

The UI is tested manually through the following workflows:
- Creating groups with multiple members
- Adding multiple expenses with different split configurations
- Verifying that displayed balances match backend calculations

## Future Enhancements

Planned improvements include:

- **Dark Mode**: Toggle between light and dark themes
- **Data Visualization**: Charts and graphs for expense trends and category breakdowns
- **CSV Export**: Download expense reports and settlement summaries
- **Push Notifications**: Real-time alerts for new expenses and settlement reminders
- **Offline Support**: Progressive Web App capabilities for offline access
- **Expense Categories**: Visual filtering and grouping by expense type
- **Search and Filter**: Advanced search functionality for expenses and groups
- **Activity Feed**: Timeline view of all group activities
