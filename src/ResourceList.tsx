// src/components/ResourceList.tsx
import React, { useEffect, useState } from 'react';
import { getResources } from './service/resourceService';
import ResourceItem from './ResourceItem';
import './ResourceList.css'; // 引入 CSS 文件

interface Resource {
    id: number;
    name: string;
    type: string;
    risk_rank: number;
    abacEnabled: boolean;
}

const ResourceList: React.FC = () => {
    const [resources, setResources] = useState<Resource[]>([]);

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const data = await getResources();
                setResources(data);
            } catch (error) {
                console.error("無法獲取資源", error);
            }
        };

        fetchResources();
    }, []);

    return (
        <div>
            <h2>ResouceList</h2>
            <div className="resource-list">
                {resources.map(resource => (
                    <ResourceItem key={resource.id} resource={resource} />
                ))}
            </div>
        </div>
    );
};

export default ResourceList;
