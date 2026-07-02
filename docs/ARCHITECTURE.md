Project Notes — AWS Community Event Management Platform
1. Architecture Decisions (for docs/ARCHITECTURE.md)
DynamoDB Table: Events
FieldValuePK (Partition (constant string)
SK (Sort Key)eventId (UUID)
Attributestitle, date, time, mode, venue, description, posterUrl, registrationLink, createdAt

Why constant PK + UUID SK: 

All events share one partition → Query PK="EVENT" cheaply returns all events (avoids expensive Scan)
UUID guarantees uniqueness even if two events share the same date
Tradeoff: constant PK risks a "hot partition" at scale — acceptable now (YAGNI) because traffic is low; revisit with a GSI if the club grows significantly

Why 3 separate Lambda functions, not 1 or 2:

createEvent (write), listEvents (read, summary), getEvent (read, full detail)
Each represents a distinct business operation with its own reason to change (Single Responsibility Principle)
Even though listEvents and getEvent are both reads with identical IAM permissions, splitting them isolates blast radius, keeps CloudWatch logs traceable per-operation, and allows independent tuning later (e.g., pagination on listEvents only)

Why S3 for posters, not DynamoDB:

DynamoDB has a 400KB hard item-size limit; images exceed this easily
DynamoDB is priced/optimized for small structured reads, not large binary blobs
Pattern used: Claim Check Pattern — S3 stores the file, DynamoDB stores only the posterUrl reference

Why On-Demand capacity mode, not Provisioned:

Traffic is unpredictable and low-volume (student club)
No capacity planning needed; scales automatically
Must pair with an AWS Budget Alert to avoid runaway billing from bugs (e.g., infinite Lambda retry loop)
Will reconsider Provisioned + auto-scaling once real usage data exists

