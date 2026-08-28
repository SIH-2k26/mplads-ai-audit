import React, { useState } from 'react';
import { Network, User, Building2, Briefcase, MapPin, Layers, Info } from 'lucide-react';
import { ProjectRelationship } from '../../types';

export function RelationshipGraph({
  relationships,
  projectTitle,
  className,
}: {
  relationships: ProjectRelationship[];
  projectTitle: string;
  className?: string;
}) {
  const [selectedNode, setSelectedNode] = useState<ProjectRelationship | null>(null);

  const getNodeIcon = (type: ProjectRelationship['targetType']) => {
    switch (type) {
      case 'MP':
        return <User className="h-4 w-4 text-[#18324A]" />;
      case 'CONTRACTOR':
        return <Briefcase className="h-4 w-4 text-[#C98219]" />;
      case 'AGENCY':
        return <Building2 className="h-4 w-4 text-[#2F7658]" />;
      case 'DISTRICT':
        return <MapPin className="h-4 w-4 text-[#B7791F]" />;
      case 'SIMILAR_PROJECT':
        return <Layers className="h-4 w-4 text-[#B44343]" />;
      default:
        return <Network className="h-4 w-4 text-[#18324A]" />;
    }
  };

  return (
    <div className={`rounded-[6px] border border-[#D9D5CC] bg-white p-5 shadow-card ${className || ''}`}>
      <div className="flex items-center justify-between border-b border-[#EDE8DE] pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-[4px] bg-[#EDE8DE] text-[#18324A]">
            <Network className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-[#18324A] uppercase tracking-wider">Entity Relationship & Syndicate Graph</h4>
            <p className="text-[11px] text-[#667085]">Network topology linking MP, Contractors, Agencies & Potential Duplicates</p>
          </div>
        </div>
        <span className="text-[11px] font-mono text-[#667085] bg-[#F7F5F0] px-2 py-0.5 rounded border border-[#D9D5CC]">
          {relationships.length + 1} Entities Mapped
        </span>
      </div>

      {/* Central Hub and Connected Nodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-[#FAFAF7] p-5 rounded-[4px] border border-[#EDE8DE]">
        {/* Connected Left Nodes */}
        <div className="space-y-3">
          {relationships.slice(0, 2).map((rel, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedNode(rel)}
              className={`p-3 rounded-[4px] border cursor-pointer transition-all ${
                selectedNode?.targetName === rel.targetName
                  ? 'bg-white border-[#18324A] shadow-card ring-1 ring-[#18324A]'
                  : 'bg-white border-[#D9D5CC] hover:border-[#18324A]'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-[#EDE8DE]">{getNodeIcon(rel.targetType)}</div>
                <div className="overflow-hidden">
                  <span className="text-[10px] uppercase font-bold text-[#667085] block">{rel.relationType.replace('_', ' ')}</span>
                  <span className="text-xs font-bold text-[#18324A] truncate block">{rel.targetName}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Center Project Hub */}
        <div className="flex flex-col items-center justify-center p-5 bg-[#18324A] text-white rounded-[6px] shadow-elevated text-center border-2 border-[#C98219]">
          <div className="h-3 w-3 rounded-full bg-[#C98219] mb-2 animate-pulse" />
          <span className="text-[10px] font-mono text-[#E7A943] uppercase tracking-wider font-bold">Anchor Project</span>
          <h5 className="text-xs font-bold mt-1 line-clamp-2">{projectTitle}</h5>
        </div>

        {/* Connected Right Nodes */}
        <div className="space-y-3">
          {relationships.slice(2).map((rel, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedNode(rel)}
              className={`p-3 rounded-[4px] border cursor-pointer transition-all ${
                selectedNode?.targetName === rel.targetName
                  ? 'bg-white border-[#18324A] shadow-card ring-1 ring-[#18324A]'
                  : 'bg-white border-[#D9D5CC] hover:border-[#18324A]'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-[#EDE8DE]">{getNodeIcon(rel.targetType)}</div>
                <div className="overflow-hidden">
                  <span className="text-[10px] uppercase font-bold text-[#667085] block">{rel.relationType.replace('_', ' ')}</span>
                  <span className="text-xs font-bold text-[#18324A] truncate block">{rel.targetName}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Relationship Detail Footnote */}
      <div className="mt-4 pt-3 border-t border-[#EDE8DE] flex items-start gap-2 text-xs text-[#667085]">
        <Info className="h-4 w-4 text-[#18324A] flex-shrink-0 mt-0.5" />
        <span>
          {selectedNode ? (
            <span>
              <strong className="text-[#18324A]">{selectedNode.targetName}:</strong> Connected as{' '}
              <strong className="text-[#C98219]">{selectedNode.relationType}</strong> (Weight:{' '}
              {selectedNode.weight * 100}%). {selectedNode.notes || 'Normal institutional entity linkage.'}
            </span>
          ) : (
            'Click any entity node in the graph to inspect connection telemetry and syndicate flags.'
          )}
        </span>
      </div>
    </div>
  );
}
