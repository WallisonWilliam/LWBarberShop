from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field as PydanticField
from sqlmodel import SQLModel, Session, create_engine, select, Field
from typing import List, Optional
from uuid import uuid4
from fastapi.middleware.cors import CORSMiddleware

DATABASE_URL = "sqlite:///schedules.db"
engine = create_engine(DATABASE_URL)

app = FastAPI()

origins = ['http://127.0.0.1:5500']

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ScheduleBase(BaseModel):
    customer: str
    date: str
    hour: str = PydanticField(..., regex=r"^\d{2}:\d{2}$", description="Hora no formato brasileiro: HH:MM")


class Schedule(ScheduleBase, SQLModel, table=True):
    id: Optional[str] = Field(default=None, primary_key=True)


class EventCreate(ScheduleBase):
    pass


class EventRead(ScheduleBase):
    id: str


class EventUpdate(ScheduleBase):
    pass


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


@app.on_event("startup")
def on_startup():
    create_db_and_tables()


schedules: List[Schedule] = []


@app.get('/schedules', response_model=List[EventRead])
def list_schedules():
    with Session(engine) as session:
        schedules = session.exec(select(Schedule)).all()
        return schedules


@app.get('/schedules/{schedule_date}', response_model=List[EventRead])
def list_schedules_date(schedule_date: str):
    with Session(engine) as session:
        return session.exec(select(Schedule).filter(Schedule.date == schedule_date)).all()


@app.post('/schedules', response_model=EventRead)
def create_schedule(schedule: Schedule):
    with Session(engine) as session:
        schedule.id = str(uuid4())
        db_schedule = Schedule.from_orm(schedule)
        session.add(db_schedule)
        session.commit()
        session.refresh(db_schedule)
        return db_schedule


"""
@app.put("/schedules/{schedule_id}", response_model=EventRead)
def update_event(schedule_id: str, name: str):
    with Session(engine) as session:
        db_schedule = session.get(Schedule, schedule_id)
        if not db_schedule:
            raise HTTPException(status_code=404, detail="Evento não encontrado")

        for key, value in name:
            if value is not None:
                setattr(db_schedule, key, value)

        session.add(db_schedule)
        session.commit()
        session.refresh(db_schedule)
        return db_schedule
"""


@app.delete("/schedules/{schedule_id}")
def delete_schedule(schedule_id: str):
    with Session(engine) as session:
        db_schedule = session.get(Schedule, schedule_id)
        if not db_schedule:
            raise HTTPException(status_code=404, detail="Evento não encontrado")
        session.delete(db_schedule)
        session.commit()
        return {"result": "Evento excluído"}
