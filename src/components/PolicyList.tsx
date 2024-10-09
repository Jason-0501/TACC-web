import React,{useEffect,useState} from "react";

import { addAllOf, addMatch, deleteAllOf, deleteMatch, getPolicies, getPolicyById, updateMatch } from "../service/policyService";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Paper,
    Box,
    Divider,
    Button,
    Select,
    MenuItem,
    TextField,
    SelectChangeEvent,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface Match {
    id: number;
    designater: string;
    attributeValue: string;
    op: string;
    dataType:  number|string;
}
  
interface AllOf {
    id: number;
    matches: Match[];
}

interface AnyOf {
    id: number;
    allOfs: AllOf[];
}

interface Target {
    id: number;
    anyOf: AnyOf;
}

interface Policy {
    id: number;
    name: string;
    effect: boolean;
    target: Target;
}

interface MatchRequest {
    designater: string;
    attributeValue: string;
    op: string;
    dataType: number;
}
const opOptions = [
    { label: 'equals', value: 'equals' },
    { label: 'not equals', value: 'not equals' },
    { label: 'greater than', value: 'greaterThan' },
    { label: 'less than', value: 'lessThan' },
    { label: 'greater than or equal to', value: 'greaterThanOrEqual' },
    { label: 'less than or equal to', value: 'lessThanOrEqual' },
];
const dataTypeOptions = [
    { label: 'STRING', value: 0 },
    { label: 'INTEGER', value: 1 },
    { label: 'BOOLEAN', value: 2 },
    { label: 'TIME', value: 3 },
    {label: "DOUBLE",value:4}
];

const PolicyList: React.FC = () => {
    const [policies, setPolicies] = useState<Policy[]>([]);
    const [expandedPolicyId, setExpandedPolicyId] = useState<number | null>(null);
    const [expandedPolicy, setExpandedPolicy] = useState<Policy | null>(null);
    const [newMatch, setNewMatch] = useState({
        designater: '',
        attributeValue: '',
        op: 'equals',
        dataType: 0,
    });
    const [formExpanded, setFormExpanded] = useState(false);
    const [editingMatchId, setEditingMatchId] = useState<number | null>(null);
    const [editMatchData, setEditMatchData] = useState<MatchRequest | null>(null);
    useEffect(() => {
        const fetchPolicies = async () => {
        const data = await getPolicies();
        setPolicies(data);
        };
        fetchPolicies();
    }, []);

    const toggleExpand = async (policyId: number) => {
        if (expandedPolicyId === policyId) {
            setExpandedPolicyId(null);
            setExpandedPolicy(null);
        } else {
            const policy = await getPolicyById(policyId);
            setExpandedPolicyId(policyId);
            setExpandedPolicy(policy);
        }
    };

    const handleAddAllOf = async (anyOfId: number) => {
        try {
          await addAllOf(anyOfId); // 呼叫 API 傳入 anyOfId
          if (expandedPolicy) {
            const updatedPolicy = await getPolicyById(expandedPolicy.id); // 再次獲取更新後的 Policy
            setExpandedPolicy(updatedPolicy); // 更新前端狀態
          }
        } catch (error) {
          console.error("Failed to add AllOf", error);
        }
    };

    const handleDeleteAllOf = async (allOfId: number) => {
        try {
          await deleteAllOf(allOfId);  // 呼叫 API 刪除 AllOf
          if (expandedPolicy) {
            const updatedPolicy = await getPolicyById(expandedPolicy.id); // 獲取更新後的政策資料
            setExpandedPolicy(updatedPolicy); // 更新前端狀態以反映變化
          }
        } catch (error) {
          console.error("Failed to delete AllOf", error);
        }
    };
    const handleMatchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewMatch({
          ...newMatch,
          [e.target.name]: e.target.value,
        });
    };
    const handleOpTypeChange = (e: SelectChangeEvent<string>,field:string) => {
        if(field==="add"){
            setNewMatch({
                ...newMatch,
                op: e.target.value as string, // 更新 dataType
            });
        }else if(field==="edit"){
            setEditMatchData({
                ...editMatchData!,
                op: e.target.value as string, // 更新 dataType
            });
        }
        
    };  
    const handleDataTypeChange = (e: SelectChangeEvent<number>,field:string) => {
        if(field==="add"){
            setNewMatch({
                ...newMatch,
                dataType: e.target.value as number, // 更新 dataType
            });
        }else if(field==="edit"){
            setEditMatchData({
                ...editMatchData!,
                dataType: e.target.value as number, // 更新 dataType
            });
        }
        
    };
    
    const handleAddMatch = async (allOfId: number) => {
        try {
            const matchWithAllofId = {...newMatch,allOf: allOfId}
            await addMatch(matchWithAllofId); // 呼叫 API 新增 Match
            if (expandedPolicy) {
                const updatedPolicy = await getPolicyById(expandedPolicy.id); // 獲取更新後的政策資料
                setExpandedPolicy(updatedPolicy); // 更新前端狀態
                setNewMatch({
                    designater: '',
                    attributeValue: '',
                    op: 'equals',
                    dataType: 0,
                  });
                  setFormExpanded(false);
            }
        } catch (error) {
            console.error("Failed to add Match", error);
        }
    };
    const handleEditClick = (match: Match) => {
        setEditingMatchId(match.id); // 設置當前正在編輯的 Match ID
        const matchRequest: MatchRequest = {
            designater: match.designater,
            attributeValue: match.attributeValue,
            op: match.op,
            dataType: dataTypeOptions.find(option => option.label === match.dataType)?.value || 0
        };
        setEditMatchData(matchRequest); // 初始化表單數據
    };
    const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (editMatchData) {
            setEditMatchData({
                ...editMatchData,
                [e.target.name]: e.target.value,
            });
        }
    };
    const handleSaveEdit = async (matchId: number) => {
        if (editMatchData) {
          try {
            
            await updateMatch(matchId,editMatchData); // 假設你有一個 updateMatch API 函數
            if (expandedPolicy) {
              const updatedPolicy = await getPolicyById(expandedPolicy.id);
              setExpandedPolicy(updatedPolicy); // 更新政策資料
            }
            setEditingMatchId(null); // 退出編輯模式
            setEditMatchData(null); // 清空編輯數據
           
        }catch (error) {
            console.error("Failed to update Match", error);
          }
        }
    };

    const handleDeleteMatch = async (matchId: number) => {
        try {
          await deleteMatch(matchId);  // 呼叫 API 刪除 AllOf
          if (expandedPolicy) {
            const updatedPolicy = await getPolicyById(expandedPolicy.id); // 獲取更新後的政策資料
            setExpandedPolicy(updatedPolicy); // 更新前端狀態以反映變化
          }
        } catch (error) {
          console.error("Failed to delete AllOf", error);
        }
    };
    return (
        <Box sx={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
          {policies.map((policy) => (
            <Accordion
              key={policy.id}
              expanded={expandedPolicyId === policy.id}
              onChange={() => toggleExpand(policy.id)}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">{policy.name}</Typography>
              </AccordionSummary>
              {expandedPolicyId === policy.id && expandedPolicy && (
                <AccordionDetails>
                    <Paper elevation={2} sx={{ padding: '20px' }}>
                        <Typography variant="subtitle1">
                        <strong>Effect:</strong> {expandedPolicy.effect ? 'Allow' : 'Deny'}
                        </Typography>
                        <Divider sx={{ marginY: '10px' }} />
                        <Typography variant="h6">Target:</Typography>
                        {/* <Typography><strong>AnyOf ID:</strong> {expandedPolicy.target.anyOf.id}</Typography> */}
                        {expandedPolicy.target.anyOf.allOfs.map((allOf) => (
                        <Box key={allOf.id} sx={{ marginY: '10px'}}>
                            <Typography variant="subtitle2">AllOf ID: {allOf.id}</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                                {allOf.matches.map((match) => (
                                <Paper key={match.id} sx={{ padding: '20px', width: '300px', backgroundColor: '#f1f1f1'  }}>
                                    
                                    {editingMatchId === match.id ? (
                                        <Box>
                                            <TextField
                                                label="Designater"
                                                name="designater"
                                                value={editMatchData?.designater || ''}
                                                onChange={handleEditInputChange}
                                            />
                                            <TextField
                                                label="Attribute Value"
                                                name="attributeValue"
                                                value={editMatchData?.attributeValue || ''}
                                                onChange={handleEditInputChange}
                                            />
                                            <Select
                                                label="Operator"
                                                name="op"
                                                value={editMatchData?.op || 'equals'}
                                                onChange={(e)=>handleOpTypeChange(e,"edit")}
                                            >
                                            {opOptions.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                            ))}
                                            </Select>
                                            <Select
                                                label="Data Type"
                                                value={dataTypeOptions.find(opt => opt.value === editMatchData?.dataType)?.value }
                                                onChange={(e)=>handleDataTypeChange(e,"edit")}
                                            >
                                            {dataTypeOptions.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                                </MenuItem>
                                            ))}
                                            </Select>
                                            <Button onClick={()=>handleSaveEdit(match.id)} variant="contained" color="primary">
                                                Save
                                            </Button>
                                            <Button onClick={() => setEditingMatchId(null)} variant="outlined" color="secondary">
                                            Cancel
                                            </Button>
                                        </Box>
                                        ) : (
                                        <Box>
                                            <Typography><strong>Designater:</strong> {match.designater}</Typography>
                                            <Typography><strong>Attribute Value:</strong> {match.attributeValue}</Typography>
                                            <Typography><strong>Operator:</strong> {match.op}</Typography>
                                            {/* <Typography><strong>Data Type:</strong> {dataTypeOptions.find(opt => opt.label === match.dataType)?.label}</Typography> */}
                                            <Typography><strong>Data Type:</strong> {match.dataType}</Typography>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-evenly', marginTop: '10px' }}>
                                                <Button onClick={() => handleEditClick(match)} variant="contained" color="primary">
                                                Edit
                                                </Button>
                                                <Button onClick={() => handleDeleteMatch(match.id)} variant="contained" color="primary">
                                                    Delete
                                                </Button>
                                            </Box>
                                        </Box>
                                        )}
                                </Paper>
                            ))}
                        </Box>
                            
                            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', marginY: '10px' }}>
                                <Button onClick={() => setFormExpanded(!formExpanded)} variant="contained" color="primary" sx={{ width: '300px', backgroundColor: '#1976d2', color: 'white' }}>
                                {formExpanded ? "Hide Form" : "Add New Match"}
                                </Button>
                            </Box>
                            {formExpanded && (
                                <Box>
                                    <TextField
                                        label="Designater"
                                        name="designater"
                                        value={newMatch.designater}
                                        onChange={handleMatchInputChange}
                                    />
                                    <TextField
                                        label="Attribute Value"
                                        name="attributeValue"
                                        value={newMatch.attributeValue}
                                        onChange={handleMatchInputChange}
                                    />
                                    <Select
                                        label="Operator"
                                        name="op"
                                        value={newMatch.op}
                                        onChange={(e)=>handleOpTypeChange(e,"add")}
                                    >
                                        {opOptions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                        ))}
                                    </Select>
                                    <Select
                                        label="Data Type"
                                        value={newMatch.dataType}
                                        onChange={(e)=>handleDataTypeChange(e,"add")}
                                    >
                                        {dataTypeOptions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                        ))}
                                    </Select>
                                    {/* 點擊新增 Match 按鈕，提交表單 */}
                                    <Button onClick={() => handleAddMatch(allOf.id)} variant="contained" color="primary">
                                        Submit Match
                                    </Button>
                                </Box>
                            )}
                            {/* 刪除 AllOf 的按鈕 */}
                            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', marginY: '10px' }}>
                                <Button
                                onClick={() => handleDeleteAllOf(allOf.id)}
                                variant="outlined"
                                color="secondary"
                                sx={{ width: '300px', border: '1px solid purple', color: 'purple' }}
                                >
                                Delete AllOf
                                </Button>
                            </Box>
                        </Box>
                        ))}
                    </Paper>
                    <Button
                        onClick={() => handleAddAllOf(expandedPolicy.target.anyOf.id)}
                        variant="contained"
                        color="primary"
                    >
                        Add New AllOf
                    </Button>
                </AccordionDetails>
              )}
            </Accordion>
          ))}
        </Box>
    );
};

export default PolicyList;