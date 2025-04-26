-- inserts into User
INSERT INTO User (Name, Email, Password) VALUES('John Smith', 'John.Smith@gmail.com', 'IAmJohn');
INSERT INTO User (Name, Email, Password) VALUES('John Smith', 'John.Smith1@gmail.com', 'IAmJohn');
INSERT INTO User (Name, Email, Password) VALUES('Sam Silver', 'Sam.Silver@gmail.com', 'IAmSam');
INSERT INTO User (Name, Email, Password) VALUES('Emma Baker', 'Emma.Baker@gmail.com', 'IAmEmma');
INSERT INTO User (Name, Email, Password) VALUES('Asa Fischer', 'asafischer42@gmail.com', 'IAmAsa');

-- inserts into Admin
INSERT INTO Admin (Name, Email, Password) VALUES('Colin Drewees', 'Colin.Drewees@gmail.com', 'IAmColin');
INSERT INTO Admin (Name, Email, Password) VALUES('Lukas Moony', 'Lukas.Moony@gmail.com', 'IAmLukas');
INSERT INTO Admin (Name, Email, Password) VALUES('Lukas Moony', 'Lukas.Moony1@gmail.com', 'IAmLukas');

-- inserts into Supplier
INSERT INTO Supplier (Name, Email, Password) VALUES('Bunsen Burner Guy', 'iheartbunsens@gmail.com', 'bunbun');
INSERT INTO Supplier (Name, Email, Password) VALUES('Microscope Guy', 'micro@gmail.com', 'smallstuff');
INSERT INTO Supplier (Name, Email, Password) VALUES('Centrifuge Guy', 'whatisacentrifuge@gmail.com', 'notsure');

-- inserts into Equipment
INSERT INTO Equipment (Part, Status, SupplierID, UserID) VALUES('Microscope', False, 2, NULL);
INSERT INTO Equipment (Part, Status, SupplierID, UserID) VALUES('Microscope', False, 2, NULL);
INSERT INTO Equipment (Part, Status, SupplierID, UserID) VALUES('Microscope', True, 2, 1);
INSERT INTO Equipment (Part, Status, SupplierID, UserID) VALUES('Centrifuge', False, 3, NULL);
INSERT INTO Equipment (Part, Status, SupplierID, UserID) VALUES('Bunsen Burner', True, 1, 3);
INSERT INTO Equipment (Part, Status, SupplierID, UserID) VALUES('Bunsen Burner', False, 1, NULL);
INSERT INTO Equipment (Part, Status, SupplierID, UserID) VALUES('Centrifuge', False, 3, NULL);
INSERT INTO Equipment (Part, Status, SupplierID, UserID) VALUES('Centrifuge', False, 3, NULL);

-- insert into Reservation
INSERT INTO Reservation (ReservationDate, Status, EquipmentID, UserID, AdminID) VALUES('2000-02-18', False, 1, 1, 1);
INSERT INTO Reservation (ReservationDate, Status, EquipmentID, UserID, AdminID) VALUES('2013-05-10', False, 2, 3, 2);
INSERT INTO Reservation (ReservationDate, Status, EquipmentID, UserID, AdminID) VALUES('2013-05-10', False, 5, 4, 3);

-- insert into Equipment-Supplier
INSERT INTO Equipment_Supplier (EquipmentID, SupplierID) VALUES(1, 2);
INSERT INTO Equipment_Supplier (EquipmentID, SupplierID) VALUES(2, 2);
INSERT INTO Equipment_Supplier (EquipmentID, SupplierID) VALUES(3, 2);
INSERT INTO Equipment_Supplier (EquipmentID, SupplierID) VALUES(4, 3);
INSERT INTO Equipment_Supplier (EquipmentID, SupplierID) VALUES(5, 1);
INSERT INTO Equipment_Supplier (EquipmentID, SupplierID) VALUES(6, 1);
INSERT INTO Equipment_Supplier (EquipmentID, SupplierID) VALUES(7, 3);
INSERT INTO Equipment_Supplier (EquipmentID, SupplierID) VALUES(8, 3);


-- insert into Equipment-Reservation
INSERT INTO Equipment_Reservation (EquipmentID, ReservationID) VALUES(1, 1);
INSERT INTO Equipment_Reservation (EquipmentID, ReservationID) VALUES(2, 2);
INSERT INTO Equipment_Reservation (EquipmentID, ReservationID) VALUES(5, 3);