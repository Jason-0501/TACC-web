// src/components/ResourceItem.tsx
import React, { useState } from 'react';
import { updateResource } from './service/resourceService';
import './ResourceItem.css'; // 引入 CSS 文件

interface Resource {
    id: number;
    name: string;
    type: string;
    risk_rank: number;
    abacEnabled: boolean;
}

interface ResourceItemProps {
    resource: Resource;
}

const ResourceItem: React.FC<ResourceItemProps> = ({ resource }) => {
    const [abacEnabled, setAbacEnabled] = useState(resource.abacEnabled);

    const handleEnable = async () => {
        try {
            await updateResource(resource.id, { abacEnabled: true });
            setAbacEnabled(true);
        } catch (error) {
            console.error("無法啟用 ABAC", error);
        }
    };

    const handleDisable = async () => {
        try {
            await updateResource(resource.id, { abacEnabled: false });
            setAbacEnabled(false);
        } catch (error) {
            console.error("無法禁用 ABAC", error);
        }
    };

    return (
        <div className="resource-card">
            <h3 className="resource-title">名稱: {resource.name}</h3>
            <p className="resource-detail"><strong>類型:</strong> {resource.type}</p>
            <p className="resource-detail"><strong>風險等級:</strong> {resource.risk_rank}</p>
            <p className="resource-detail"><strong>ABAC 啟用:</strong> {abacEnabled ? '是' : '否'}</p>
            <div className="button-group">
                <button 
                    onClick={handleEnable} 
                    disabled={abacEnabled} 
                    className={`resource-button enable-button ${abacEnabled ? 'disabled' : ''}`}
                >
                    啟用 ABAC
                </button>
                <button 
                    onClick={handleDisable} 
                    disabled={!abacEnabled} 
                    className={`resource-button disable-button ${!abacEnabled ? 'disabled' : ''}`}
                >
                    禁用 ABAC
                </button>
            </div>
        </div>
    );
};

export default ResourceItem;
