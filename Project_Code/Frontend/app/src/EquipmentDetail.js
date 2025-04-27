import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const EquipmentDetail = () => {
    const { equipmentId } = useParams(); // Get the equipment ID from the URL
    const [equipment, setEquipment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEquipmentDetail = async () => {
            try {
                const response = await fetch(`http://localhost:5000/equipment/${equipmentId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch equipment details');
                }
                const data = await response.json();
                setEquipment(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEquipmentDetail();
    }, [equipmentId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!equipment) {
        return <div>No equipment found</div>;
    }

    return (
        <div className="equipment-detail-container">
            <h1>Equipment Details</h1>
            <div className="equipment-detail-card">
                <p><strong>Part:</strong> {equipment.Part}</p>
                <p><strong>Status:</strong> {equipment.Status}</p>
                <p><strong>Supplier ID:</strong> {equipment.SupplierID}</p>
                <p><strong>Reserved By:</strong> {equipment.UserName || 'N/A'}</p>
            </div>
            <Link className="back-link" to="/equipment">Back to Equipment List</Link>
        </div>
    );
};

export default EquipmentDetail;
