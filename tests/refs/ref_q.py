import numpy as np, json, math
from scipy.linalg import dft
n=4
I=np.eye(2);X=np.array([[0,1],[1,0]],complex);Y=np.array([[0,-1j],[1j,0]]);Z=np.diag([1,-1]).astype(complex);H=np.array([[1,1],[1,-1]],complex)/math.sqrt(2)
S=np.diag([1,1j]);T=np.diag([1,np.exp(1j*math.pi/4)])
def rx(t):return np.array([[math.cos(t/2),-1j*math.sin(t/2)],[-1j*math.sin(t/2),math.cos(t/2)]])
def ry(t):return np.array([[math.cos(t/2),-math.sin(t/2)],[math.sin(t/2),math.cos(t/2)]],complex)
def rz(t):return np.diag([np.exp(-1j*t/2),np.exp(1j*t/2)])
def full1(U,k):
    M=np.array([[1]],complex)
    for q in range(n-1,-1,-1): M=np.kron(M,U if q==k else I)
    return M
def ctrl(U,cs,k):
    N=2**n;M=np.zeros((N,N),complex)
    for i in range(N):
        if all((i>>c)&1 for c in cs):
            b=(i>>k)&1
            for nb in range(2):
                j=(i&~(1<<k))|(nb<<k);M[j,i]+=U[nb,b]
        else:M[i,i]=1
    return M
st=np.zeros(2**n,complex);st[0]=1
def ap(M):
    global st;st=M@st
ap(full1(H,0));ap(ctrl(X,[0],2));ap(full1(T,1));ap(full1(ry(.7),3));ap(ctrl(Z,[1],3));ap(full1(H,2));ap(ctrl(np.diag([1,np.exp(1j*math.pi/3)]),[0],3))
# swap 1 2
def swapM(a,b):
    N=2**n;M=np.zeros((N,N),complex)
    for i in range(N):
        ba=(i>>a)&1;bb=(i>>b)&1;j=i&~(1<<a)&~(1<<b);j|=(bb<<a)|(ba<<b);M[j,i]=1
    return M
ap(swapM(1,2));ap(full1(rz(1.1),0));ap(ctrl(X,[0,1],3));ap(full1(S,2));ap(full1(rx(-.4),1))
R=dict(text="H 0; CNOT 0 2; T 1; RY(0.7) 3; CZ 1 3; H 2; CP(pi/3) 0 3; SWAP 1 2; RZ(1.1) 0; CCX 0 1 3; S 2; RX(-0.4) 1",re=st.real.tolist(),im=st.imag.tolist())
# reduced bloch qubit 1 and 0 from numpy
psi=st.reshape([2]*n)  # axis order: qubit n-1 .. 0
def bloch(k):
    ax=n-1-k;m=np.moveaxis(psi,ax,0).reshape(2,-1);rho=m@m.conj().T
    return [2*rho[0,1].real,-2*rho[0,1].imag,(rho[0,0]-rho[1,1]).real]
R['bloch']=[bloch(k) for k in range(n)]
# QFT reference: scipy dft with ifft-normalization sign: |j> -> sum_k e^{+2pi i jk/N}
N=8;F=np.conj(dft(N,scale='sqrtn'));j=5;R['qft']=dict(j=j,re=F[:,j].real.tolist(),im=F[:,j].imag.tolist())
json.dump(R,open('ref_q.json','w'))
print(R['bloch'])
