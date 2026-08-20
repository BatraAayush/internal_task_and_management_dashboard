import random
from datetime import datetime, timedelta
from app.core.database import engine, SessionLocal, Base
import app.models as models

# Initialize tables
Base.metadata.create_all(bind=engine)
db = SessionLocal()

print("🧹 Cleaning old database records...")
db.query(models.Comment).delete()
db.query(models.Task).delete()
db.query(models.User).delete()
db.commit()

print("🌱 Seeding Users...")
users_data = [
    {"name": "Dev Mamgain", "email": "dev.mamgain@internal.io", "role": "Lead Full-Stack Developer"},
    {"name": "Sarah Chen", "email": "sarah.chen@internal.io", "role": "Senior Frontend Engineer"},
    {"name": "Alex Rivera", "email": "alex.rivera@internal.io", "role": "Backend Architect"},
    {"name": "Priya Sharma", "email": "priya.sharma@internal.io", "role": "Product Manager"},
    {"name": "Marcus Vance", "email": "marcus.vance@internal.io", "role": "UI/UX Designer"},
]

users = [models.User(**u) for u in users_data]
db.add_all(users)
db.commit()

db_users = db.query(models.User).all()
user_map = {u.name: u.id for u in db_users}
user_ids = [u.id for u in db_users]

print("🌱 Seeding Tasks & Comments...")
now = datetime.utcnow()

sample_tasks = [
    {
        "title": "Fix Stripe webhook signature verification",
        "description": "Payment webhook fails on production when signature contains special characters. Needs raw payload comparison.",
        "status": "In Progress",
        "priority": "Urgent",
        "assigned_to": user_map["Dev Mamgain"],
        "due_date": now - timedelta(days=2),  # Overdue
        "comments": ["Investigated logs, happening on charge.failed events.", "Applying raw body parsing fix."]
    },
    {
        "title": "Migrate dashboard components to Tailwind CSS",
        "description": "Standardize custom SCSS into atomic Tailwind classes for faster rendering.",
        "status": "Completed",
        "priority": "Medium",
        "assigned_to": user_map["Sarah Chen"],
        "due_date": now - timedelta(days=1),
        "comments": ["All modals and tables refactored successfully."]
    },
    {
        "title": "Implement Redis query caching for Task List API",
        "description": "High database read latency during peak hours. Add 60s cache on paginated task queries.",
        "status": "Blocked",
        "priority": "High",
        "assigned_to": user_map["Alex Rivera"],
        "due_date": now + timedelta(days=1),
        "comments": ["Blocked waiting for DevOps to provision Redis cluster in staging."]
    },
    {
        "title": "Design responsive specs for Task Detail drawer",
        "description": "Create desktop and mobile variations in Figma with comment thread interactions.",
        "status": "Completed",
        "priority": "Low",
        "assigned_to": user_map["Marcus Vance"],
        "due_date": now - timedelta(days=4),
        "comments": ["Figma link shared in Slack channel."]
    },
    {
        "title": "Setup Automated CI/CD with GitHub Actions",
        "description": "Build pipeline executing pytest, ESLint, and automated deployment to AWS ECS.",
        "status": "Pending",
        "priority": "High",
        "assigned_to": user_map["Dev Mamgain"],
        "due_date": now + timedelta(days=4),
        "comments": []
    },
    {
        "title": "Database indexing audit on tasks & comments tables",
        "description": "Add composite indexes on (status, priority) and (assigned_to, due_date) to speed up filtering.",
        "status": "In Progress",
        "priority": "Medium",
        "assigned_to": user_map["Alex Rivera"],
        "due_date": now + timedelta(days=3),
        "comments": ["Analyzing EXPLAIN ANALYZE execution trees."]
    },
    {
        "title": "Integrate External Team Directory API",
        "description": "Expose external partner list with fallback error states, timeout handling, and proxy endpoint.",
        "status": "Pending",
        "priority": "Medium",
        "assigned_to": user_map["Sarah Chen"],
        "due_date": now + timedelta(days=5),
        "comments": []
    },
    {
        "title": "Prepare Sprint Demo & Q3 Product Roadmap",
        "description": "Summarize task management KPI gains and team velocity for executive review.",
        "status": "Pending",
        "priority": "Low",
        "assigned_to": user_map["Priya Sharma"],
        "due_date": now + timedelta(days=6),
        "comments": []
    },
    {
        "title": "Resolve JWT token expiration race condition",
        "description": "Users report sudden logouts when multiple API requests trigger simultaneous refresh tokens.",
        "status": "In Progress",
        "priority": "Urgent",
        "assigned_to": user_map["Dev Mamgain"],
        "due_date": now - timedelta(days=1),  # Overdue
        "comments": ["Implemented mutex lock on refresh client side."]
    },
    {
        "title": "Accessibility audit (WCAG 2.1 AA Compliance)",
        "description": "Ensure proper ARIA attributes, keyboard navigation for modals, and color contrast on badges.",
        "status": "Pending",
        "priority": "Low",
        "assigned_to": user_map["Marcus Vance"],
        "due_date": now + timedelta(days=7),
        "comments": []
    }
]

for task_info in sample_tasks:
    task = models.Task(
        title=task_info["title"],
        description=task_info["description"],
        status=task_info["status"],
        priority=task_info["priority"],
        assigned_to=task_info["assigned_to"],
        due_date=task_info["due_date"],
        created_at=now - timedelta(days=random.randint(2, 10)),
        updated_at=now
    )
    db.add(task)
    db.commit()
    db.refresh(task)

    for comm_text in task_info["comments"]:
        comment = models.Comment(
            task_id=task.id,
            user_id=random.choice(user_ids),
            comment=comm_text,
            created_at=now - timedelta(hours=random.randint(1, 24))
        )
        db.add(comment)

db.commit()
db.close()
print("✅ Database seeding complete! Run 'uvicorn main:app --reload' to start.")