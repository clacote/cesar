ALTER TABLE Session ADD SLOT_ID BIGINT;
ALTER TABLE Session ADD FOREIGN KEY (SLOT_ID) REFERENCES Slot (ID);