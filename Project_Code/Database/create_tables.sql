-- User table
CREATE TABLE User (
    UserID INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT NOT NULL,
    Email TEXT NOT NULL UNIQUE,
    Password TEXT NOT NULL
);

-- Admin table
CREATE TABLE Admin (
    AdminID INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT NOT NULL,
    Email TEXT NOT NULL UNIQUE,
    Password TEXT NOT NULL
);

-- Supplier table
CREATE TABLE Supplier (
    SupplierID INTEGER PRIMARY KEY AUTOINCREMENT
);

-- Equipment table
CREATE TABLE Equipment (
    EquipmentID INTEGER PRIMARY KEY AUTOINCREMENT,
    Part TEXT NOT NULL,
    Status BOOLEAN NOT NULL,
    SupplierID INTEGER,
    UserID INTEGER,
    FOREIGN KEY (SupplierID) REFERENCES Supplier(SupplierID),
    FOREIGN KEY (UserID) REFERENCES User(UserID)
);

-- Reservation table
CREATE TABLE Reservation (
    ReservationID INTEGER PRIMARY KEY AUTOINCREMENT,
    ReservationDate DATE NOT NULL,
    Status BOOLEAN NOT NULL,
    EquipmentID INTEGER,
    UserID INTEGER,
    AdminID INTEGER,
    FOREIGN KEY (EquipmentID) REFERENCES Equipment(EquipmentID),
    FOREIGN KEY (UserID) REFERENCES User(UserID),
    FOREIGN KEY (AdminID) REFERENCES Admin(AdminID)
);

-- Equipment-Supplier Relationship table
CREATE TABLE Equipment_Supplier (
    EquipmentID INTEGER,
    SupplierID INTEGER,
    PRIMARY KEY (EquipmentID, SupplierID),
    FOREIGN KEY (EquipmentID) REFERENCES Equipment(EquipmentID),
    FOREIGN KEY (SupplierID) REFERENCES Supplier(SupplierID)
);

-- Equipment-Reservation Relationship table
CREATE TABLE Equipment_Reservation (
    EquipmentID INTEGER,
    ReservationID INTEGER,
    PRIMARY KEY (EquipmentID, ReservationID),
    FOREIGN KEY (EquipmentID) REFERENCES Equipment(EquipmentID),
    FOREIGN KEY (ReservationID) REFERENCES Reservation(ReservationID)
);
