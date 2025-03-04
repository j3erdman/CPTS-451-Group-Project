-- User table
CREATE TABLE User (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Password VARCHAR(100) NOT NULL
);

-- Admin table
CREATE TABLE Admin (
    AdminID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Password VARCHAR(100) NOT NULL
);

-- Supplier table
CREATE TABLE Supplier (
    SupplierID INT AUTO_INCREMENT PRIMARY KEY
);

-- Equipment table
CREATE TABLE Equipment (
    EquipmentID INT AUTO_INCREMENT PRIMARY KEY,
    Part VARCHAR(100) NOT NULL,
    Status BOOL NOT NULL,
    SupplierID INT,
    UserID INT,
    FOREIGN KEY (SupplierID) REFERENCES Supplier(SupplierID),
    FOREIGN KEY (UserID) REFERENCES User(UserID)
);

-- Reservation table
CREATE TABLE Reservation (
    ReservationID INT AUTO_INCREMENT PRIMARY KEY,
    ReservationDate DATE NOT NULL,
    Status VARCHAR(100) NOT NULL,
    EquipmentID INT,
    UserID INT,
    AdminID INT,
    FOREIGN KEY (EquipmentID) REFERENCES Equipment(EquipmentID),
    FOREIGN KEY (UserID) REFERENCES User(UserID),
    FOREIGN KEY (AdminID) REFERENCES Admin(AdminID)
);

-- Equipment-Supplier Relationship table
CREATE TABLE Equipment_Supplier (
    EquipmentID INT,
    SupplierID INT,
    PRIMARY KEY (EquipmentID, SupplierID),
    FOREIGN KEY (EquipmentID) REFERENCES Equipment(EquipmentID),
    FOREIGN KEY (SupplierID) REFERENCES Supplier(SupplierID)
);

-- Equipment-Reservation Relationship table
CREATE TABLE Equipment_Reservation (
    EquipmentID INT,
    ReservationID INT,
    PRIMARY KEY (EquipmentID, ReservationID),
    FOREIGN KEY (EquipmentID) REFERENCES Equipment(EquipmentID),
    FOREIGN KEY (ReservationID) REFERENCES Reservation(ReservationID)
);